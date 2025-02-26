
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

  // Wait for component to mount before showing languages
  useEffect(() => {
    setMounted(true);
  }, []);

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
          <Languages className="h-4 w-4 mr-2" />
          {isRTL ? 'العربية' : 'English'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
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
