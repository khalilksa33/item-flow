
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // Initialize language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      console.log('Initializing language from localStorage:', savedLanguage);
      i18n.changeLanguage(savedLanguage);
      
      // Update document direction based on saved language
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
      
      if (savedLanguage === 'ar') {
        document.body.classList.add('rtl');
      } else {
        document.body.classList.remove('rtl');
      }
    } else if (!savedLanguage) {
      // If no saved language, save the current one
      localStorage.setItem('preferredLanguage', i18n.language);
    }
    
    setMounted(true);
  }, [i18n]);

  const changeLanguage = (language: string) => {
    console.log('Changing language to:', language);
    i18n.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
    
    // Update document direction based on language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    if (language === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // Force reload to ensure all components update properly
    window.location.reload();
  };

  if (!mounted) return null;
  
  const currentLanguage = i18n.language;
  const isRTL = currentLanguage === 'ar';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Languages className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {isRTL ? 'العربية' : 'English'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          English {currentLanguage === 'en' && '✓'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('ar')}>
          العربية {currentLanguage === 'ar' && '✓'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
