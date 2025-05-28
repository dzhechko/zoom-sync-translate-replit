import { useState, useEffect, useCallback } from 'react';
import { SpeechVoice } from '@/types/translation';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState<SpeechVoice[]>([]);
  const [isSupported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window);

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      const voiceList: SpeechVoice[] = availableVoices.map(voice => ({
        name: voice.name,
        lang: voice.lang,
        voiceURI: voice.voiceURI
      }));
      setVoices(voiceList);
    };

    // Load voices immediately if available
    loadVoices();

    // Some browsers load voices asynchronously
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [isSupported]);

  const speak = useCallback((text: string, voiceURI?: string, rate: number = 1.0) => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    if (voiceURI && voiceURI !== 'default') {
      const selectedVoice = voices.find(voice => voice.voiceURI === voiceURI);
      if (selectedVoice) {
        const speechVoice = speechSynthesis.getVoices().find(v => v.voiceURI === voiceURI);
        if (speechVoice) {
          utterance.voice = speechVoice;
        }
      }
    }

    speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
    }
  }, [isSupported]);

  return {
    voices,
    isSupported,
    speak,
    stop
  };
};
