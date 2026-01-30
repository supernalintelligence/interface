'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'supernal-api-key';
const ENCRYPTED_STORAGE_KEY = 'supernal-vault-v1';

export type ApiKeyStatus = 'none' | 'validating' | 'valid' | 'invalid' | 'locked';

export interface ApiKeyState {
  apiKey: string | null;
  status: ApiKeyStatus;
  error: string | null;
  maskedKey: string | null;
}

export interface UseApiKeyStorageOptions {
  /**
   * Enable encrypted storage (requires passphrase)
   * @default false
   */
  encrypted?: boolean;

  /**
   * Callback when passphrase is needed for encrypted storage
   */
  onPassphraseRequired?: () => Promise<string>;

  /**
   * Callback when passphrase is invalid
   */
  onPassphraseInvalid?: () => void;
}

/**
 * Validates Anthropic API key format
 * Keys should start with 'sk-ant-' and be at least 50 characters
 */
function validateApiKeyFormat(key: string): { valid: boolean; error?: string } {
  if (!key || key.trim() === '') {
    return { valid: false, error: 'API key is required' };
  }

  if (!key.startsWith('sk-ant-')) {
    return { valid: false, error: 'Invalid format. Keys start with "sk-ant-"' };
  }

  if (key.length < 50) {
    return { valid: false, error: 'API key appears too short' };
  }

  return { valid: true };
}

/**
 * Creates a masked version of the API key for display
 * Shows first 10 chars + "..." + last 4 chars
 */
function maskApiKey(key: string): string {
  if (key.length <= 14) return '\u2022'.repeat(key.length);
  return `${key.slice(0, 10)}...${key.slice(-4)}`;
}

/**
 * Validates API key by making a minimal test request to Anthropic
 */
async function validateApiKeyWithAnthropic(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      }),
    });

    if (response.ok) {
      return { valid: true };
    }

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
      return { valid: false, error: 'Invalid API key' };
    }

    if (response.status === 403) {
      return { valid: false, error: 'API key does not have permission' };
    }

    if (response.status === 429) {
      return { valid: true };
    }

    return { valid: false, error: data.error?.message || 'Validation failed' };
  } catch (err) {
    console.warn('Could not validate API key with Anthropic:', err);
    return validateApiKeyFormat(apiKey);
  }
}

// ============================================================================
// Simple Encryption Helpers (Web Crypto API)
// For full enterprise features, use EncryptedStorageAdapter from @supernal/interface-enterprise
// ============================================================================

const SALT_LENGTH = 32;
const IV_LENGTH = 12;
const ITERATIONS = 100_000; // Lower than enterprise (1M) for better UX in browser

interface EncryptedEntry {
  version: 1;
  ciphertext: string;
  salt: string;
  iv: string;
  encryptedAt: number;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const saltBuffer = salt.buffer.slice(salt.byteOffset, salt.byteOffset + salt.byteLength) as ArrayBuffer;
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltBuffer, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptValue(key: CryptoKey, plaintext: string, salt: Uint8Array): Promise<EncryptedEntry> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const ivBuffer = iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer;
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: ivBuffer },
    key,
    new TextEncoder().encode(plaintext)
  );

  return {
    version: 1,
    ciphertext: arrayBufferToBase64(ciphertext),
    salt: uint8ArrayToBase64(salt),
    iv: uint8ArrayToBase64(iv),
    encryptedAt: Date.now(),
  };
}

async function decryptValue(key: CryptoKey, entry: EncryptedEntry): Promise<string> {
  const ciphertext = base64ToArrayBuffer(entry.ciphertext);
  const iv = base64ToUint8Array(entry.iv);
  const ivBuffer = iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength) as ArrayBuffer;

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBuffer },
    key,
    ciphertext
  );

  return new TextDecoder().decode(plaintext);
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function uint8ArrayToBase64(array: Uint8Array): string {
  const buffer = array.buffer.slice(array.byteOffset, array.byteOffset + array.byteLength) as ArrayBuffer;
  return arrayBufferToBase64(buffer);
}

function base64ToUint8Array(base64: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(base64));
}

function loadEncryptedEntry(): EncryptedEntry | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(ENCRYPTED_STORAGE_KEY);
    if (stored) {
      const entry = JSON.parse(stored);
      if (entry.version === 1 && entry.ciphertext && entry.salt) {
        return entry;
      }
    }
  } catch {
    // Not valid JSON
  }
  return null;
}

// ============================================================================

/**
 * Hook for managing API key storage with validation
 *
 * This is the simple single-site version using localStorage.
 * Compatible with future VaultClient integration for cross-site support.
 *
 * Features:
 * - localStorage persistence (single site)
 * - Format validation (sk-ant-* prefix, minimum length)
 * - Optional live validation with Anthropic API
 * - Masked display for security
 * - Optional encryption at rest (Phase 1 of vault system)
 *
 * @param options - Configuration options
 */
export function useApiKeyStorage(options: UseApiKeyStorageOptions = {}) {
  const [state, setState] = useState<ApiKeyState>({
    apiKey: null,
    status: options.encrypted ? 'locked' : 'none',
    error: null,
    maskedKey: null,
  });

  // Store derived key and salt for encrypted mode
  const derivedKeyRef = useRef<CryptoKey | null>(null);
  const saltRef = useRef<Uint8Array | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If encryption is enabled, we need passphrase first
    if (options.encrypted) {
      // Check if we have encrypted data
      const entry = loadEncryptedEntry();
      if (entry) {
        // Data exists, stay locked until unlock() is called
        setState(prev => ({ ...prev, status: 'locked' }));
      } else {
        // No encrypted data yet, still need to set up passphrase
        setState(prev => ({ ...prev, status: 'locked' }));
      }
      return;
    }

    // Unencrypted mode - load from plain localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const validation = validateApiKeyFormat(saved);
        setState({
          apiKey: saved,
          status: validation.valid ? 'valid' : 'invalid',
          error: validation.error || null,
          maskedKey: maskApiKey(saved),
        });
      }
    } catch (err) {
      console.error('Failed to load API key from storage:', err);
    }
  }, [options.encrypted]);

  /**
   * Unlock encrypted storage with a passphrase
   * @param passphrase - User passphrase to derive encryption key
   * @returns true if unlock succeeded, false if passphrase is wrong
   */
  const unlock = useCallback(async (passphrase: string): Promise<boolean> => {
    if (!options.encrypted) {
      return true; // No encryption, always "unlocked"
    }

    try {
      const entry = loadEncryptedEntry();

      if (entry) {
        // Existing data: derive key from stored salt and try to decrypt
        const salt = base64ToUint8Array(entry.salt);
        const key = await deriveKey(passphrase, salt);

        try {
          const apiKey = await decryptValue(key, entry);

          // Success - store key and salt for future operations
          derivedKeyRef.current = key;
          saltRef.current = salt;

          const validation = validateApiKeyFormat(apiKey);
          setState({
            apiKey,
            status: validation.valid ? 'valid' : 'invalid',
            error: validation.error || null,
            maskedKey: maskApiKey(apiKey),
          });
          return true;
        } catch {
          // Wrong passphrase - decryption failed
          options.onPassphraseInvalid?.();
          return false;
        }
      } else {
        // No existing data - generate fresh salt and store key
        const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
        const key = await deriveKey(passphrase, salt);

        derivedKeyRef.current = key;
        saltRef.current = salt;

        setState(prev => ({
          ...prev,
          status: 'none', // Unlocked but no key yet
        }));
        return true;
      }
    } catch (error) {
      console.error('[useApiKeyStorage] Unlock failed:', error);
      return false;
    }
  }, [options.encrypted, options.onPassphraseInvalid]);

  /**
   * Lock encrypted storage (clear derived key from memory)
   */
  const lock = useCallback(() => {
    if (!options.encrypted) return;

    derivedKeyRef.current = null;
    // Keep salt in case user unlocks again

    setState(prev => ({
      ...prev,
      status: 'locked',
      apiKey: null,
      maskedKey: null,
    }));
  }, [options.encrypted]);

  /**
   * Set and validate a new API key
   */
  const setApiKey = useCallback(async (key: string, validate = true): Promise<boolean> => {
    const formatValidation = validateApiKeyFormat(key);

    if (!formatValidation.valid) {
      setState({
        apiKey: null,
        status: 'invalid',
        error: formatValidation.error || 'Invalid API key',
        maskedKey: null,
      });
      return false;
    }

    setState({
      apiKey: key,
      status: validate ? 'validating' : 'valid',
      error: null,
      maskedKey: maskApiKey(key),
    });

    // Save to storage (encrypted or plain)
    try {
      if (options.encrypted && derivedKeyRef.current && saltRef.current) {
        const entry = await encryptValue(derivedKeyRef.current, key, saltRef.current);
        localStorage.setItem(ENCRYPTED_STORAGE_KEY, JSON.stringify(entry));
      } else {
        localStorage.setItem(STORAGE_KEY, key);
      }
    } catch (err) {
      console.error('Failed to save API key:', err);
    }

    if (validate) {
      const liveValidation = await validateApiKeyWithAnthropic(key);

      setState(prev => ({
        ...prev,
        status: liveValidation.valid ? 'valid' : 'invalid',
        error: liveValidation.error || null,
      }));

      return liveValidation.valid;
    }

    return true;
  }, [options.encrypted]);

  /**
   * Clear the stored API key
   */
  const clearApiKey = useCallback(() => {
    try {
      if (options.encrypted) {
        localStorage.removeItem(ENCRYPTED_STORAGE_KEY);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to clear API key:', err);
    }

    setState({
      apiKey: null,
      status: options.encrypted ? 'locked' : 'none',
      error: null,
      maskedKey: null,
    });
  }, [options.encrypted]);

  /**
   * Re-validate the current API key
   */
  const revalidate = useCallback(async (): Promise<boolean> => {
    if (!state.apiKey) return false;
    return setApiKey(state.apiKey, true);
  }, [state.apiKey, setApiKey]);

  return {
    ...state,
    hasApiKey: !!state.apiKey && state.status === 'valid',
    isLocked: state.status === 'locked',
    setApiKey,
    clearApiKey,
    revalidate,
    unlock,
    lock,
  };
}

export type UseApiKeyStorageReturn = ReturnType<typeof useApiKeyStorage>;
