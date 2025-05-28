import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { translations } from '@/lib/i18n';
import { TranscriptionSegment, ExportData } from '@/types/translation';
import { storage } from '@/lib/storage';

interface ExportModalProps {
  isOpen: boolean;
  language: 'ru' | 'en';
  segments: TranscriptionSegment[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  language,
  segments,
  onClose
}) => {
  const [exportData, setExportData] = useState<ExportData>({
    transcripts: true,
    translations: true,
    timestamps: false,
    format: 'txt'
  });

  const t = translations[language];

  const handleExport = () => {
    storage.exportData(segments, exportData.format, {
      includeTranscripts: exportData.transcripts,
      includeTranslations: exportData.translations,
      includeTimestamps: exportData.timestamps
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Download className="text-primary mr-2" />
            {t.export.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="transcripts"
                checked={exportData.transcripts}
                onCheckedChange={(checked) => 
                  setExportData(prev => ({ ...prev, transcripts: !!checked }))
                }
              />
              <Label htmlFor="transcripts" className="font-medium">
                {t.export.transcripts}
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="translations"
                checked={exportData.translations}
                onCheckedChange={(checked) => 
                  setExportData(prev => ({ ...prev, translations: !!checked }))
                }
              />
              <Label htmlFor="translations" className="font-medium">
                {t.export.translations}
              </Label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="timestamps"
                checked={exportData.timestamps}
                onCheckedChange={(checked) => 
                  setExportData(prev => ({ ...prev, timestamps: !!checked }))
                }
              />
              <Label htmlFor="timestamps" className="font-medium">
                {t.export.timestamps}
              </Label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="format">{t.export.format}</Label>
            <Select value={exportData.format} onValueChange={(value: 'txt' | 'json' | 'csv') => 
              setExportData(prev => ({ ...prev, format: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">Текстовый файл (.txt)</SelectItem>
                <SelectItem value="json">JSON (.json)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            {t.export.cancel}
          </Button>
          <Button onClick={handleExport} className="shadow-lg">
            {t.export.download}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
