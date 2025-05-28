export interface Translation {
  app: {
    title: string;
  };
  controls: {
    language: string;
    title: string;
    sourceLanguage: string;
    targetLanguage: string;
    startRecording: string;
    stopRecording: string;
    recording: string;
    audioLevel: string;
  };
  transcript: {
    title: string;
    clear: string;
    export: string;
    original: string;
    translated: string;
    waitingOriginal: string;
    waitingTranslated: string;
    translating: string;
  };
  settings: {
    title: string;
    translation: string;
    voice: string;
    speechRate: string;
    aiModel: string;
    openaiModel: string;
    apiKey: string;
    apiKeyHelp: string;
    costWarning: string;
    costDetails: string;
    advanced: string;
    chunkSize: string;
    chunkHelp: string;
    autoPlay: string;
    autoPlayHelp: string;
    reset: string;
    cancel: string;
    save: string;
  };
  privacy: {
    title: string;
    micTitle: string;
    micDescription: string;
    dataTitle: string;
    dataDescription: string;
    apiTitle: string;
    apiDescription: string;
    compliance: string;
    decline: string;
    accept: string;
  };
  export: {
    title: string;
    transcripts: string;
    translations: string;
    timestamps: string;
    format: string;
    cancel: string;
    download: string;
  };
  error: {
    message: string;
    retry: string;
    retryCount: string;
    microphoneAccess: string;
    apiKeyRequired: string;
    translationFailed: string;
    networkError: string;
  };
  currentLang: string;
}

export const translations: Record<string, Translation> = {
  ru: {
    app: { title: 'Переводчик речи' },
    controls: {
      language: 'Язык:',
      title: 'Управление записью',
      sourceLanguage: 'Исходный язык',
      targetLanguage: 'Целевой язык',
      startRecording: 'Начать запись',
      stopRecording: 'Остановить запись',
      recording: 'Запись...',
      audioLevel: 'Уровень аудио'
    },
    transcript: {
      title: 'Транскрипция и перевод',
      clear: 'Очистить',
      export: 'Экспорт',
      original: 'Оригинальный текст',
      translated: 'Переведенный текст',
      waitingOriginal: 'Начните говорить, чтобы увидеть транскрипцию...',
      waitingTranslated: 'Переводы будут появляться здесь...',
      translating: 'Переводим...'
    },
    settings: {
      title: 'Настройки',
      translation: 'Настройки перевода',
      voice: 'Голос для озвучивания',
      speechRate: 'Скорость речи',
      aiModel: 'Настройки ИИ модели',
      openaiModel: 'OpenAI модель',
      apiKey: 'OpenAI API ключ',
      apiKeyHelp: 'Ключ сохраняется локально в браузере и не передается на наш сервер',
      costWarning: 'Внимание: использование API OpenAI платное',
      costDetails: 'Стоимость зависит от выбранной модели и объема переводимого текста.',
      advanced: 'Дополнительные настройки',
      chunkSize: 'Размер сегмента (мс)',
      chunkHelp: 'Частота отправки аудио на перевод (меньше = быстрее, больше = точнее)',
      autoPlay: 'Автовоспроизведение',
      autoPlayHelp: 'Автоматически озвучивать переводы',
      reset: 'Сбросить настройки',
      cancel: 'Отменить',
      save: 'Сохранить'
    },
    privacy: {
      title: 'Политика конфиденциальности',
      micTitle: 'Использование микрофона',
      micDescription: 'Приложение использует микрофон для захвата аудио в реальном времени. Данные обрабатываются локально и передаются на сервер только для перевода.',
      dataTitle: 'Хранение данных',
      dataDescription: 'Все настройки сохраняются локально в браузере. Мы не храним ваши аудиозаписи или переводы на сервере.',
      apiTitle: 'API ключ OpenAI',
      apiDescription: 'Ваш API ключ сохраняется только в браузере и используется для отправки запросов перевода напрямую в OpenAI.',
      compliance: 'Приложение соответствует требованиям GDPR и CCPA. Используя это приложение, вы соглашаетесь с обработкой данных как описано выше.',
      decline: 'Отклонить',
      accept: 'Я согласен'
    },
    export: {
      title: 'Экспорт данных',
      transcripts: 'Транскрипции',
      translations: 'Переводы',
      timestamps: 'Временные метки',
      format: 'Формат файла',
      cancel: 'Отменить',
      download: 'Скачать'
    },
    error: {
      message: 'Ошибка подключения к серверу',
      retry: 'Повторить',
      retryCount: 'Попытка {count} из 3',
      microphoneAccess: 'Не удалось получить доступ к микрофону',
      apiKeyRequired: 'Требуется OpenAI API ключ',
      translationFailed: 'Ошибка перевода',
      networkError: 'Ошибка сети'
    },
    currentLang: 'РУС'
  },
  en: {
    app: { title: 'Speech Translator' },
    controls: {
      language: 'Language:',
      title: 'Recording Control',
      sourceLanguage: 'Source Language',
      targetLanguage: 'Target Language',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      recording: 'Recording...',
      audioLevel: 'Audio Level'
    },
    transcript: {
      title: 'Transcription and Translation',
      clear: 'Clear',
      export: 'Export',
      original: 'Original Text',
      translated: 'Translated Text',
      waitingOriginal: 'Start speaking to see transcription...',
      waitingTranslated: 'Translations will appear here...',
      translating: 'Translating...'
    },
    settings: {
      title: 'Settings',
      translation: 'Translation Settings',
      voice: 'Speech Voice',
      speechRate: 'Speech Rate',
      aiModel: 'AI Model Settings',
      openaiModel: 'OpenAI Model',
      apiKey: 'OpenAI API Key',
      apiKeyHelp: 'Key is stored locally in browser and not sent to our server',
      costWarning: 'Warning: OpenAI API usage is paid',
      costDetails: 'Cost depends on selected model and amount of translated text.',
      advanced: 'Advanced Settings',
      chunkSize: 'Segment Size (ms)',
      chunkHelp: 'Frequency of sending audio for translation (smaller = faster, larger = more accurate)',
      autoPlay: 'Auto-play',
      autoPlayHelp: 'Automatically play translations',
      reset: 'Reset Settings',
      cancel: 'Cancel',
      save: 'Save'
    },
    privacy: {
      title: 'Privacy Policy',
      micTitle: 'Microphone Usage',
      micDescription: 'App uses microphone to capture audio in real-time. Data is processed locally and sent to server only for translation.',
      dataTitle: 'Data Storage',
      dataDescription: 'All settings are stored locally in browser. We do not store your audio recordings or translations on server.',
      apiTitle: 'OpenAI API Key',
      apiDescription: 'Your API key is stored only in browser and used to send translation requests directly to OpenAI.',
      compliance: 'App complies with GDPR and CCPA requirements. By using this app, you agree to data processing as described above.',
      decline: 'Decline',
      accept: 'I Agree'
    },
    export: {
      title: 'Export Data',
      transcripts: 'Transcripts',
      translations: 'Translations',
      timestamps: 'Timestamps',
      format: 'File Format',
      cancel: 'Cancel',
      download: 'Download'
    },
    error: {
      message: 'Server connection error',
      retry: 'Retry',
      retryCount: 'Attempt {count} of 3',
      microphoneAccess: 'Unable to access microphone',
      apiKeyRequired: 'OpenAI API key required',
      translationFailed: 'Translation failed',
      networkError: 'Network error'
    },
    currentLang: 'ENG'
  }
};

export const getLanguageOptions = (): Array<{ code: string; name: string }> => [
  { code: 'ru-RU', name: 'Русский' },
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Español' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-PT', name: 'Português' },
  { code: 'zh-CN', name: '中文' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' }
];

export const getTargetLanguageOptions = (): Array<{ code: string; name: string }> => [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' }
];

export const getOpenAIModels = (): Array<{ code: string; name: string }> => [
  { code: 'gpt-4o', name: 'GPT-4o (Оптимальный)' },
  { code: 'gpt-4', name: 'GPT-4 (Точный)' },
  { code: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Быстрый)' }
];
