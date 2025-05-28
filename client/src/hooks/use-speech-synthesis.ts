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

  const findVoiceByLanguage = useCallback((targetLanguage: string) => {
    const availableVoices = speechSynthesis.getVoices();
    
    // Language code mapping for better voice selection
    const languageMap: Record<string, string[]> = {
      'zh': ['zh-CN', 'zh-TW', 'zh-HK', 'zh'],
      'ja': ['ja-JP', 'ja'],
      'ko': ['ko-KR', 'ko'],
      'en': ['en-US', 'en-GB', 'en-AU', 'en'],
      'ru': ['ru-RU', 'ru'],
      'es': ['es-ES', 'es-MX', 'es'],
      'fr': ['fr-FR', 'fr-CA', 'fr'],
      'de': ['de-DE', 'de'],
      'it': ['it-IT', 'it'],
      'pt': ['pt-PT', 'pt-BR', 'pt']
    };

    const possibleCodes = languageMap[targetLanguage] || [targetLanguage];
    
    // Try to find a voice that matches the target language
    for (const code of possibleCodes) {
      const voice = availableVoices.find(v => v.lang.startsWith(code));
      if (voice) {
        return voice;
      }
    }
    
    return null;
  }, []);

  const speak = useCallback((text: string, voiceURI?: string, rate: number = 1.0, targetLanguage?: string) => {
    if (!isSupported || !text.trim()) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;

    // If a specific voice is selected and it's not default, use it
    if (voiceURI && voiceURI !== 'default') {
      const speechVoice = speechSynthesis.getVoices().find(v => v.voiceURI === voiceURI);
      if (speechVoice) {
        utterance.voice = speechVoice;
      }
    } 
    // Otherwise, try to find a voice that matches the target language
    else if (targetLanguage) {
      const autoVoice = findVoiceByLanguage(targetLanguage);
      if (autoVoice) {
        utterance.voice = autoVoice;
        utterance.lang = autoVoice.lang;
      }
    }

    speechSynthesis.speak(utterance);
  }, [isSupported, findVoiceByLanguage]);

  const stop = useCallback(() => {
    if (isSupported) {
      speechSynthesis.cancel();
    }
  }, [isSupported]);

  const getVoicesForLanguage = useCallback((targetLanguage: string) => {
    // Language code mapping for voice filtering
    const languageMap: Record<string, string[]> = {
      'zh': ['zh-CN', 'zh-TW', 'zh-HK', 'zh'],
      'ja': ['ja-JP', 'ja'],
      'ko': ['ko-KR', 'ko'],
      'en': ['en-US', 'en-GB', 'en-AU', 'en'],
      'ru': ['ru-RU', 'ru'],
      'es': ['es-ES', 'es-MX', 'es'],
      'fr': ['fr-FR', 'fr-CA', 'fr'],
      'de': ['de-DE', 'de'],
      'it': ['it-IT', 'it'],
      'pt': ['pt-PT', 'pt-BR', 'pt']
    };

    const possibleCodes = languageMap[targetLanguage] || [targetLanguage];
    
    // Filter voices that match the target language
    return voices.filter(voice => 
      possibleCodes.some(code => voice.lang.startsWith(code))
    );
  }, [voices]);

  return {
    voices,
    isSupported,
    speak,
    stop,
    getVoicesForLanguage
  };
};
