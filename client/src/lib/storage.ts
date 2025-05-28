import { TranslationSettings, TranscriptionSegment } from "@/types/translation";

const STORAGE_KEYS = {
  SETTINGS: 'speechTranslator_settings',
  CONSENT: 'speechTranslator_consent',
  THEME: 'speechTranslator_theme',
  LANGUAGE: 'speechTranslator_language'
} as const;

const DEFAULT_SETTINGS: TranslationSettings = {
  sourceLanguage: 'ru-RU',
  targetLanguage: 'en',
  voice: 'default',
  openaiModel: 'gpt-4o',
  apiKey: '',
  speechRate: 1.0,
  chunkSize: 3000,
  autoPlay: true
};

export const storage = {
  // Settings
  getSettings(): TranslationSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: TranslationSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Consent
  getConsent(): boolean {
    return localStorage.getItem(STORAGE_KEYS.CONSENT) === 'true';
  },

  setConsent(consent: boolean): void {
    localStorage.setItem(STORAGE_KEYS.CONSENT, consent.toString());
  },

  // Theme
  getTheme(): 'light' | 'dark' | null {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    return theme === 'dark' || theme === 'light' ? theme : null;
  },

  setTheme(theme: 'light' | 'dark'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // UI Language
  getLanguage(): 'ru' | 'en' {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return lang === 'en' ? 'en' : 'ru';
  },

  setLanguage(language: 'ru' | 'en'): void {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  },

  // Export data
  exportData(segments: TranscriptionSegment[], format: 'txt' | 'json' | 'csv', options: {
    includeTranscripts: boolean;
    includeTranslations: boolean;
    includeTimestamps: boolean;
  }): void {
    const { includeTranscripts, includeTranslations, includeTimestamps } = options;
    
    if (format === 'txt') {
      const lines: string[] = [];
      segments.forEach(segment => {
        if (includeTimestamps) {
          lines.push(`[${segment.timestamp.toLocaleString()}]`);
        }
        if (includeTranscripts) {
          lines.push(`Original: ${segment.text}`);
        }
        if (includeTranslations && segment.translation) {
          lines.push(`Translation: ${segment.translation}`);
        }
        lines.push('---');
      });
      this.downloadFile(lines.join('\n'), 'transcript.txt', 'text/plain');
    }
    
    else if (format === 'json') {
      const data = segments.map(segment => ({
        ...(includeTimestamps && { timestamp: segment.timestamp.toISOString() }),
        ...(includeTranscripts && { text: segment.text }),
        ...(includeTranslations && segment.translation && { translation: segment.translation })
      }));
      this.downloadFile(JSON.stringify(data, null, 2), 'transcript.json', 'application/json');
    }
    
    else if (format === 'csv') {
      const headers: string[] = [];
      if (includeTimestamps) headers.push('Timestamp');
      if (includeTranscripts) headers.push('Original Text');
      if (includeTranslations) headers.push('Translation');
      
      const csvLines = [headers.join(',')];
      segments.forEach(segment => {
        const row: string[] = [];
        if (includeTimestamps) row.push(`"${segment.timestamp.toISOString()}"`);
        if (includeTranscripts) row.push(`"${segment.text.replace(/"/g, '""')}"`);
        if (includeTranslations) row.push(`"${(segment.translation || '').replace(/"/g, '""')}"`);
        csvLines.push(row.join(','));
      });
      this.downloadFile(csvLines.join('\n'), 'transcript.csv', 'text/csv');
    }
  },

  downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
