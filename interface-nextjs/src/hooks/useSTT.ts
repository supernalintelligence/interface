/**
 * Efficient Speech-to-Text Hook
 *
 * Priority: Native device STT (free, real-time)
 * - Web: Web Speech API (built-in, free)
 * - Mobile: Capacitor Speech Recognition (native, free)
 * - Fallback: Whisper API (premium, if native unavailable)
 */

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';

export interface UseSTTResult {
  /**
   * Start listening for speech
   */
  startListening: () => Promise<void>;

  /**
   * Stop listening
   */
  stopListening: () => void;

  /**
   * Reset transcript
   */
  resetTranscript: () => void;

  /**
   * Is currently listening
   */
  isListening: boolean;

  /**
   * Final transcript (complete)
   */
  transcript: string;

  /**
   * Interim transcript (in-progress)
   */
  interimTranscript: string;

  /**
   * Error message if any
   */
  error: string | null;

  /**
   * Is STT supported on this platform
   */
  isSupported: boolean;
}

/**
 * Platform detection
 */
const Platform = {
  isNative: typeof window !== 'undefined' && 'Capacitor' in window,
  isWeb: typeof window !== 'undefined' && !('Capacitor' in window),
};

/**
 * Efficient Speech-to-Text Hook
 *
 * Uses free native speech recognition by default
 */
export function useSTT(): UseSTTResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Check if STT is supported
  const isSupported = useMemo(() => {
    if (Platform.isNative) {
      // Capacitor Speech Recognition always available on mobile
      return true;
    }

    if (Platform.isWeb) {
      return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    }

    return false;
  }, []);

  /**
   * Initialize Web Speech API (browser)
   */
  useEffect(() => {
    if (!isSupported || Platform.isNative) return;

    // Web: Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = false; // Stop after silence
    recognition.interimResults = true; // Show live transcription
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) setTranscript(final);
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isSupported]);

  /**
   * Start listening for speech
   */
  const startListening = useCallback(async () => {
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    setIsListening(true);

    try {
      // Native mobile: Capacitor Speech Recognition
      if (Platform.isNative) {
        // @ts-ignore - Capacitor types
        const { SpeechRecognition: CapSpeech } = await import('@capacitor-community/speech-recognition');

        // Request permissions
        await CapSpeech.requestPermissions();

        // Start recognition
        const { matches } = await CapSpeech.start({
          language: 'en-US',
          maxResults: 1,
          popup: false,
        });

        setTranscript(matches[0] || '');
        setIsListening(false);
        return;
      }

      // Web: Start Web Speech API
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        throw new Error('Speech recognition not initialized');
      }
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setError(err instanceof Error ? err.message : 'Failed to start microphone');
      setIsListening(false);
    }
  }, []);

  /**
   * Stop listening
   */
  const stopListening = useCallback(() => {
    if (Platform.isNative) {
      // Native: Capacitor handles stop automatically
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  /**
   * Reset transcript
   */
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    startListening,
    stopListening,
    resetTranscript,
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
  };
}
