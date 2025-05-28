import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, MicOff, Database, Key } from 'lucide-react';
import { translations } from '@/lib/i18n';

interface PrivacyModalProps {
  isOpen: boolean;
  language: 'ru' | 'en';
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({
  isOpen,
  language,
  onAccept,
  onDecline
}) => {
  const t = translations[language];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <Shield className="text-primary text-2xl" />
            {t.privacy.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <MicOff className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">
              {t.privacy.micTitle}
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              {t.privacy.micDescription}
            </AlertDescription>
          </Alert>
          
          <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
            <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-900 dark:text-green-100">
              {t.privacy.dataTitle}
            </AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              {t.privacy.dataDescription}
            </AlertDescription>
          </Alert>
          
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
            <Key className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertTitle className="text-amber-900 dark:text-amber-100">
              {t.privacy.apiTitle}
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              {t.privacy.apiDescription}
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t.privacy.compliance}
          </p>
        </div>
        
        <DialogFooter className="flex justify-end space-x-3">
          <Button variant="ghost" onClick={onDecline}>
            {t.privacy.decline}
          </Button>
          <Button onClick={onAccept} className="shadow-lg">
            {t.privacy.accept}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
