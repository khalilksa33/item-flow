
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import translationEN from '../public/locales/en/translation.json';
import translationAR from '../public/locales/ar/translation.json';

import inventoryEN from '../public/locales/en/inventory.json';
import inventoryAR from '../public/locales/ar/inventory.json';

import appEN from '../public/locales/en/app.json';
import appAR from '../public/locales/ar/app.json';

import commonEN from '../public/locales/en/common.json';
import commonAR from '../public/locales/ar/common.json';

// the translations
const resources = {
  en: {
    translation: translationEN,
    inventory: inventoryEN,
    app: appEN,
    common: commonEN
  },
  ar: {
    translation: translationAR,
    inventory: inventoryAR,
    app: appAR,
    common: commonAR
  }
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
