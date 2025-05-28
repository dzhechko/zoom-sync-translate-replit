import { useState, useCallback } from 'react';
import { createTranslationService } from '@/lib/translation-service';
import { TranslateRequest, TranslateResponse } from '@shared/schema';

interface UseTranslationProps {
  apiKey: string;
  onError: (error: string) => void;
}

export const useTranslation = ({ apiKey, onError }: UseTranslationProps) => {
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = useCallback(async (request: TranslateRequest): Promise<TranslateResponse | null> => {
    if (!apiKey.trim()) {
      onError('OpenAI API key is required');
      return null;
    }

    setIsTranslating(true);
    
    try {
      const translationService = createTranslationService(apiKey);
      const result = await translationService.translate(request);
      return result;
    } catch (error) {
      console.error('Translation error:', error);
      onError(error instanceof Error ? error.message : 'Translation failed');
      return null;
    } finally {
      setIsTranslating(false);
    }
  }, [apiKey, onError]);

  return {
    translate,
    isTranslating
  };
};
