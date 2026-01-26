/**
 * Efficient Text-to-Speech Hook
 *
 * Priority: Native device TTS first (free, offline), API fallback (premium quality)
 * - Web: SpeechSynthesis API (built-in, free)
 * - Mobile: Capacitor TTS (native, free)
 * - API: Supernal TTS (premium voices, requires network)
 */

import { useState, useRef, useCallback } from 'react';

export interface TTSOptions {
  /**
   * Text to speak
   */
  text: string;

  /**
   * Voice name (maps to native or API voice)
   */
  voice?: string;

  /**
   * Playback speed (0.5 - 2.0)
   */
  speed?: number;

  /**
   * Prefer native TTS over API (default: true - free!)
   */
  preferNative?: boolean;

  /**
   * Use premium API voices (default: false - requires opt-in)
   */
  usePremium?: boolean;

  /**
   * Callback when speech completes
   */
  onComplete?: () => void;

  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
}

export interface UseTTSResult {
  /**
   * Speak text using TTS
   */
  speak: (options: TTSOptions) => Promise<void>;

  /**
   * Stop current speech
   */
  stop: () => void;

  /**
   * Is TTS currently playing
   */
  isPlaying: boolean;

  /**
   * Error message if any
   */
  error: string | null;

  /**
   * Is native TTS supported
   */
  isNativeSupported: boolean;

  /**
   * Currently speaking text
   */
  currentText: string | null;
}

/**
 * Platform detection
 */
const Platform = {
  isNative: typeof window !== 'undefined' && 'Capacitor' in window,
  isWeb: typeof window !== 'undefined' && !('Capacitor' in window),
};

/**
 * Check if native TTS is supported
 */
function isNativeTTSSupported(): boolean {
  if (Platform.isNative) {
    // Capacitor TTS always available on mobile
    return true;
  }

  if (Platform.isWeb && 'speechSynthesis' in window) {
    return true;
  }

  return false;
}

/**
 * Efficient TTS Hook
 *
 * Defaults to free native TTS, falls back to premium API when opted in
 */
export function useTTS(): UseTTSResult {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const isNativeSupported = isNativeTTSSupported();

  /**
   * Speak using native device TTS (FREE)
   */
  const speakNative = useCallback(
    async (text: string, options: { voice?: string; speed?: number } = {}) => {
      // Mobile: Capacitor TTS
      if (Platform.isNative) {
        try {
          // @ts-ignore - Capacitor types
          const { TextToSpeech } = await import('@capacitor/text-to-speech');
          await TextToSpeech.speak({
            text,
            lang: 'en-US',
            rate: options.speed || 1.0,
          });
        } catch (err) {
          throw new Error('Capacitor TTS failed: ' + (err as Error).message);
        }
        return;
      }

      // Web: SpeechSynthesis API
      if ('speechSynthesis' in window) {
        return new Promise<void>((resolve, reject) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = options.speed || 1.0;

          // Map voice name to native voice
          if (options.voice) {
            const voices = window.speechSynthesis.getVoices();
            const voice = voices.find(v =>
              v.name.toLowerCase().includes(options.voice!.toLowerCase())
            );
            if (voice) utterance.voice = voice;
          }

          utterance.onend = () => {
            utteranceRef.current = null;
            resolve();
          };

          utterance.onerror = (e) => {
            utteranceRef.current = null;
            reject(new Error('SpeechSynthesis error: ' + e.error));
          };

          utteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        });
      }

      throw new Error('Native TTS not supported on this platform');
    },
    []
  );

  /**
   * Speak using Supernal TTS API (PREMIUM)
   */
  const speakAPI = useCallback(
    async (text: string, options: { voice?: string; speed?: number } = {}) => {
      const apiUrl = process.env.NEXT_PUBLIC_TTS_API_URL || 'https://tts.supernal.ai';
      const apiKey = process.env.NEXT_PUBLIC_TTS_API_KEY || '';

      if (!apiKey && !apiUrl.includes('localhost')) {
        throw new Error('TTS_API_KEY not configured for premium voices');
      }

      const response = await fetch(`${apiUrl}/api/v1/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'X-API-Key': apiKey }),
        },
        body: JSON.stringify({
          text,
          options: {
            provider: 'openai',
            voice: options.voice || 'alloy',
            speed: 1.0, // Always generate at 1.0x, adjust playback client-side
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API failed: ${response.status} ${response.statusText}`);
      }

      // Handle different response formats
      const contentType = response.headers.get('content-type') || '';
      let audioUrl: string;

      if (contentType.includes('audio')) {
        // Direct audio stream
        const blob = await response.blob();
        audioUrl = URL.createObjectURL(blob);
      } else {
        // JSON response
        const data = await response.json();
        if (data.audio) {
          // Base64 audio
          const blob = base64ToBlob(data.audio, 'audio/mpeg');
          audioUrl = URL.createObjectURL(blob);
        } else if (data.audioUrl) {
          audioUrl = data.audioUrl;
        } else {
          throw new Error('Invalid TTS API response format');
        }
      }

      // Play audio with client-side speed adjustment
      const audio = new Audio(audioUrl);
      audio.playbackRate = options.speed || 1.0;

      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          resolve();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          reject(new Error('Audio playback failed'));
        };

        audioRef.current = audio;
        audio.play().catch(reject);
      });
    },
    []
  );

  /**
   * Main speak function
   */
  const speak = useCallback(
    async (options: TTSOptions) => {
      const {
        text,
        voice,
        speed = 1.0,
        preferNative = true,
        usePremium = false,
        onComplete,
        onError,
      } = options;

      // Stop any current speech
      stop();

      setIsPlaying(true);
      setError(null);
      setCurrentText(text);

      try {
        // Priority 1: Native (free, offline) UNLESS user explicitly wants premium
        if (preferNative && !usePremium && isNativeSupported) {
          await speakNative(text, { voice, speed });
        } else {
          // Priority 2: API (premium quality)
          await speakAPI(text, { voice, speed });
        }

        onComplete?.();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown TTS error';
        setError(errorMsg);

        // Fallback: Try native if API fails
        if (usePremium && isNativeSupported) {
          try {
            console.warn('Premium TTS failed, falling back to native');
            await speakNative(text, { voice, speed });
            onComplete?.();
            setError(null); // Clear error if fallback succeeds
          } catch (fallbackErr) {
            onError?.(fallbackErr as Error);
          }
        } else {
          onError?.(err as Error);
        }
      } finally {
        setIsPlaying(false);
        setCurrentText(null);
      }
    },
    [speakNative, speakAPI, isNativeSupported]
  );

  /**
   * Stop current speech
   */
  const stop = useCallback(() => {
    // Stop Web Speech API
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }

    // Stop API audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setIsPlaying(false);
    setCurrentText(null);
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    error,
    isNativeSupported,
    currentText,
  };
}

/**
 * Helper: Convert base64 to Blob
 */
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
