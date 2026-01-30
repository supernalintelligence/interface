'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useApiKeyStorage, UseApiKeyStorageReturn, ApiKeyStatus } from '../hooks/useApiKeyStorage';

/**
 * Context for API key management across the application
 *
 * This provides a centralized way to manage BYOK API keys.
 * Currently uses simple localStorage; will integrate with
 * VaultClient for cross-site support in the future.
 */
const ApiKeyContext = createContext<UseApiKeyStorageReturn | null>(null);

export interface ApiKeyProviderProps {
  children: React.ReactNode;
  /**
   * Optional initial API key (e.g., from environment variable for dev)
   * If provided and no key is in storage, this will be used
   */
  initialApiKey?: string;
}

export function ApiKeyProvider({ children, initialApiKey }: ApiKeyProviderProps) {
  const apiKeyStorage = useApiKeyStorage();

  // If initialApiKey is provided and no key is stored, set it
  React.useEffect(() => {
    if (initialApiKey && !apiKeyStorage.apiKey && apiKeyStorage.status === 'none') {
      // Set without validation for dev convenience (validate=false)
      apiKeyStorage.setApiKey(initialApiKey, false);
    }
  }, [initialApiKey, apiKeyStorage]);

  return (
    <ApiKeyContext.Provider value={apiKeyStorage}>
      {children}
    </ApiKeyContext.Provider>
  );
}

/**
 * Hook to access API key state and methods
 * Must be used within ApiKeyProvider
 */
export function useApiKey(): UseApiKeyStorageReturn {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return context;
}

/**
 * Hook to optionally access API key state
 * Returns null if not within ApiKeyProvider (no error thrown)
 */
export function useApiKeyOptional(): UseApiKeyStorageReturn | null {
  return useContext(ApiKeyContext);
}

// Re-export types for convenience
export type { ApiKeyStatus, UseApiKeyStorageReturn };
