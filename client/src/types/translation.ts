export interface TranscriptionSegment {
  id: string;
  text: string;
  translation?: string;
  timestamp: Date;
  isTranslating?: boolean;
}

export interface TranslationSettings {
  sourceLanguage: string;
  targetLanguage: string;
  voice: string;
  openaiModel: string;
  apiKey: string;
  speechRate: number;
  chunkSize: number;
  autoPlay: boolean;
}

export interface SpeechVoice {
  name: string;
  lang: string;
  voiceURI: string;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export interface ExportData {
  transcripts: boolean;
  translations: boolean;
  timestamps: boolean;
  format: 'txt' | 'json' | 'csv';
}
