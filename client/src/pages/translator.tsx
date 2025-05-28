import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Languages, 
  MicOff, 
  Square, 
  FileText, 
  Download, 
  Trash2, 
  Settings as SettingsIcon,
  Sun, 
  Moon,
  Globe,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { PrivacyModal } from '@/components/privacy-modal';
import { SettingsModal } from '@/components/settings-modal';
import { ExportModal } from '@/components/export-modal';
import { useTheme } from '@/components/theme-provider';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { useTranslation } from '@/hooks/use-translation';
import { storage } from '@/lib/storage';
import { translations, getLanguageOptions, getTargetLanguageOptions } from '@/lib/i18n';
import { TranslationSettings, TranscriptionSegment } from '@/types/translation';
import { useToast } from '@/hooks/use-toast';

export default function TranslatorPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  // State
  const [uiLanguage, setUiLanguage] = useState<'ru' | 'en'>(() => storage.getLanguage());
  const [hasConsent, setHasConsent] = useState(() => storage.getConsent());
  const [settings, setSettings] = useState<TranslationSettings>(() => storage.getSettings());
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Hooks
  const { voices, speak } = useSpeechSynthesis();
  
  const handleSpeechResult = useCallback((text: string) => {
    const newSegment: TranscriptionSegment = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: new Date(),
      isTranslating: true
    };
    
    setSegments(prev => [...prev, newSegment]);
    
    // Translate the text
    translate({
      text: text.trim(),
      sourceLanguage: settings.sourceLanguage,
      targetLanguage: settings.targetLanguage,
      model: settings.openaiModel
    }).then(response => {
      if (response) {
        setSegments(prev => prev.map(segment => 
          segment.id === newSegment.id 
            ? { ...segment, translation: response.translatedText, isTranslating: false }
            : segment
        ));
        
        // Auto-play translation if enabled
        if (settings.autoPlay && response.translatedText) {
          speak(response.translatedText, settings.voice, settings.speechRate, settings.targetLanguage);
        }
      } else {
        setSegments(prev => prev.map(segment => 
          segment.id === newSegment.id 
            ? { ...segment, isTranslating: false }
            : segment
        ));
      }
    });
  }, [settings]);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setRetryCount(prev => prev + 1);
    
    toast({
      title: "Ошибка",
      description: errorMessage,
      variant: "destructive"
    });
  }, [toast]);

  const { startListening, stopListening, isListening, isSupported } = useSpeechRecognition({
    language: settings.sourceLanguage,
    onResult: handleSpeechResult,
    onError: handleError
  });

  const { translate, isTranslating } = useTranslation({
    apiKey: settings.apiKey,
    onError: handleError
  });

  // Effects
  useEffect(() => {
    storage.setLanguage(uiLanguage);
  }, [uiLanguage]);

  useEffect(() => {
    storage.saveSettings(settings);
  }, [settings]);

  // Simulate audio level for visual feedback
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isRecording]);

  // Handle recording toggle
  const toggleRecording = async () => {
    if (!settings.apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please configure your OpenAI API key in settings",
        variant: "destructive"
      });
      setShowSettings(true);
      return;
    }

    if (isRecording) {
      stopListening();
      setIsRecording(false);
    } else {
      const success = await startListening();
      if (success) {
        setIsRecording(true);
        setError(null);
        setRetryCount(0);
      }
    }
  };

  const clearTranscripts = () => {
    setSegments([]);
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    if (retryCount < 3) {
      toggleRecording();
    }
  };

  const t = translations[uiLanguage];
  const languageOptions = getLanguageOptions();
  const targetLanguageOptions = getTargetLanguageOptions();

  if (!hasConsent) {
    return (
      <PrivacyModal
        isOpen={!hasConsent}
        language={uiLanguage}
        onAccept={() => {
          storage.setConsent(true);
          setHasConsent(true);
        }}
        onDecline={() => {
          window.close();
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Languages className="text-primary text-2xl" />
              <h1 className="text-xl font-semibold">{t.app.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{t.controls.language}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUiLanguage(uiLanguage === 'ru' ? 'en' : 'ru')}
                  className="flex items-center space-x-2"
                >
                  <Globe className="h-4 w-4" />
                  <span>{t.currentLang}</span>
                </Button>
              </div>
              
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'light' ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-400" />
                )}
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
                <Badge variant="outline" className="text-red-600 dark:text-red-300">
                  {t.error.retryCount.replace('{count}', retryCount.toString())}
                </Badge>
              </div>
              {retryCount < 3 && (
                <Button size="sm" variant="outline" onClick={handleRetry}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  {t.error.retry}
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MicOff className="text-primary mr-2" />
                  {t.controls.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.controls.sourceLanguage}
                    </label>
                    <Select 
                      value={settings.sourceLanguage} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, sourceLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(option => (
                          <SelectItem key={option.code} value={option.code}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t.controls.targetLanguage}
                    </label>
                    <Select 
                      value={settings.targetLanguage} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, targetLanguage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {targetLanguageOptions.map(option => (
                          <SelectItem key={option.code} value={option.code}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Recording Control */}
                <div className="text-center">
                  <Button
                    onClick={toggleRecording}
                    disabled={!isSupported || isTranslating}
                    className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                      isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                    size="lg"
                  >
                    {isRecording ? (
                      <>
                        <Square className="mr-3" />
                        {t.controls.stopRecording}
                      </>
                    ) : (
                      <>
                        <MicOff className="mr-3" />
                        {t.controls.startRecording}
                      </>
                    )}
                  </Button>
                  
                  {isRecording && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-800 dark:text-red-200 font-medium">
                          {t.controls.recording}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Audio Level */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t.controls.audioLevel}
                  </label>
                  <Progress value={audioLevel} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Transcript Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center">
                  <FileText className="text-primary mr-2" />
                  {t.transcript.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={clearTranscripts}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t.transcript.clear}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => setShowExport(true)}
                    disabled={segments.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {t.transcript.export}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Original Text */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    {t.transcript.original}
                  </h3>
                  <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-y-auto text-sm">
                    {segments.length === 0 ? (
                      <div className="text-gray-500 dark:text-gray-400 italic">
                        {t.transcript.waitingOriginal}
                      </div>
                    ) : (
                      segments.map(segment => (
                        <div key={segment.id} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded border-l-4 border-primary">
                          <span className="text-xs text-gray-500">
                            {segment.timestamp.toLocaleTimeString()}
                          </span>
                          <br />
                          {segment.text}
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Translated Text */}
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                    {t.transcript.translated}
                  </h3>
                  <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-y-auto text-sm">
                    {segments.length === 0 ? (
                      <div className="text-gray-500 dark:text-gray-400 italic">
                        {t.transcript.waitingTranslated}
                      </div>
                    ) : (
                      segments.map(segment => (
                        <div key={`${segment.id}-translation`} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded border-l-4 border-green-500">
                          <span className="text-xs text-gray-500">
                            {segment.timestamp.toLocaleTimeString()}
                          </span>
                          <br />
                          {segment.isTranslating ? (
                            <span className="text-blue-600 dark:text-blue-400 italic">
                              {t.transcript.translating}
                            </span>
                          ) : (
                            segment.translation || ''
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={showSettings}
        language={uiLanguage}
        settings={settings}
        voices={voices}
        onSave={setSettings}
        onClose={() => setShowSettings(false)}
      />
      
      <ExportModal
        isOpen={showExport}
        language={uiLanguage}
        segments={segments}
        onClose={() => setShowExport(false)}
      />
    </div>
  );
}
