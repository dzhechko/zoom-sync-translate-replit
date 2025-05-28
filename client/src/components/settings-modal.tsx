import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Eye, EyeOff, Settings, Languages, Bot, Sliders, AlertTriangle, X } from 'lucide-react';
import { translations, getLanguageOptions, getTargetLanguageOptions, getOpenAIModels } from '@/lib/i18n';
import { TranslationSettings, SpeechVoice } from '@/types/translation';

interface SettingsModalProps {
  isOpen: boolean;
  language: 'ru' | 'en';
  settings: TranslationSettings;
  voices: SpeechVoice[];
  getVoicesForLanguage: (targetLanguage: string) => SpeechVoice[];
  onSave: (settings: TranslationSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  language,
  settings,
  voices,
  getVoicesForLanguage,
  onSave,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState<TranslationSettings>(settings);
  const [showApiKey, setShowApiKey] = useState(false);
  const t = translations[language];

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: TranslationSettings = {
      sourceLanguage: 'ru-RU',
      targetLanguage: 'en',
      voice: 'default',
      openaiModel: 'gpt-4o',
      apiKey: '',
      speechRate: 1.0,
      chunkSize: 3000,
      autoPlay: true
    };
    setLocalSettings(defaultSettings);
  };

  const languageOptions = getLanguageOptions();
  const targetLanguageOptions = getTargetLanguageOptions();
  const modelOptions = getOpenAIModels();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-2xl">
              <Settings className="text-primary mr-2" />
              {t.settings.title}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Translation Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Languages className="text-primary mr-2" />
              {t.settings.translation}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="sourceLanguage">{t.settings.sourceLanguage}</Label>
                <Select value={localSettings.sourceLanguage} onValueChange={(value) => 
                  setLocalSettings(prev => ({ ...prev, sourceLanguage: value }))
                }>
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
                <Label htmlFor="targetLanguage">{t.settings.targetLanguage}</Label>
                <Select value={localSettings.targetLanguage} onValueChange={(value) => 
                  setLocalSettings(prev => ({ ...prev, targetLanguage: value }))
                }>
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
              
              <div>
                <Label htmlFor="voice">{t.settings.voice}</Label>
                <Select value={localSettings.voice} onValueChange={(value) => 
                  setLocalSettings(prev => ({ ...prev, voice: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Системный голос по умолчанию</SelectItem>
                    {voices.map(voice => (
                      <SelectItem key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>{t.settings.speechRate}</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm text-gray-500">0.5x</span>
                  <Slider
                    value={[localSettings.speechRate]}
                    onValueChange={([value]) => 
                      setLocalSettings(prev => ({ ...prev, speechRate: value }))
                    }
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">2x</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Текущая: {localSettings.speechRate.toFixed(1)}x
                </div>
              </div>
            </div>
          </div>
          
          {/* AI Model Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Bot className="text-primary mr-2" />
              {t.settings.aiModel}
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="openaiModel">{t.settings.openaiModel}</Label>
                <Select value={localSettings.openaiModel} onValueChange={(value) => 
                  setLocalSettings(prev => ({ ...prev, openaiModel: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modelOptions.map(option => (
                      <SelectItem key={option.code} value={option.code}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="apiKey">{t.settings.apiKey}</Label>
                <div className="relative">
                  <Input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    placeholder="sk-..."
                    value={localSettings.apiKey}
                    onChange={(e) => 
                      setLocalSettings(prev => ({ ...prev, apiKey: e.target.value }))
                    }
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 px-3"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t.settings.apiKeyHelp}
                </p>
              </div>
              
              <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-900 dark:text-amber-100">
                  {t.settings.costWarning}
                </AlertTitle>
                <AlertDescription className="text-amber-800 dark:text-amber-200">
                  {t.settings.costDetails}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
        
        {/* Advanced Settings */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Sliders className="text-primary mr-2" />
            {t.settings.advanced}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="chunkSize">{t.settings.chunkSize}</Label>
              <Input
                id="chunkSize"
                type="number"
                value={localSettings.chunkSize}
                onChange={(e) => 
                  setLocalSettings(prev => ({ ...prev, chunkSize: parseInt(e.target.value) || 3000 }))
                }
                min={1000}
                max={10000}
                step={500}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t.settings.chunkHelp}
              </p>
            </div>
            
            <div>
              <div className="flex items-center space-x-3">
                <Switch
                  id="autoPlay"
                  checked={localSettings.autoPlay}
                  onCheckedChange={(checked) => 
                    setLocalSettings(prev => ({ ...prev, autoPlay: checked }))
                  }
                />
                <Label htmlFor="autoPlay">{t.settings.autoPlay}</Label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t.settings.autoPlayHelp}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-6 bg-gray-50 dark:bg-gray-700 -mx-6 -mb-6 px-6 pb-6 rounded-b-xl">
          <Button variant="destructive" onClick={handleReset}>
            {t.settings.reset}
          </Button>
          <div className="flex space-x-3">
            <Button variant="ghost" onClick={onClose}>
              {t.settings.cancel}
            </Button>
            <Button onClick={handleSave} className="shadow-lg">
              {t.settings.save}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
