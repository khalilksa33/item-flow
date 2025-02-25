
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useEffect } from 'react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    // Store the language preference
    localStorage.setItem('preferredLanguage', language);
    // Update document direction
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  // Initialize language direction
  useEffect(() => {
    const currentLanguage = i18n.language || 'en';
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [i18n.language]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-4 w-4" />
          <span className="sr-only">{t('language.changeLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          {t('language.english')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ar')}>
          {t('language.arabic')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
