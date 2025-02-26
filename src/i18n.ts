
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next
i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    // Load all namespaces by default
    ns: [
      'common',
      'app',
      'auth',
      'dashboard',
      'inventory',
      'customers',
      'sales',
      'quotations',
      'invoices',
      'vendors',
      'admin',
      'tips'
    ],
    defaultNS: 'common',
    fallbackNS: 'common',
    
    // Configure backend to load translations
    resources: {
      en: {
        common: require('../public/locales/en/common.json'),
        app: require('../public/locales/en/app.json'),
        auth: require('../public/locales/en/auth.json'),
        dashboard: require('../public/locales/en/dashboard.json'),
        inventory: require('../public/locales/en/inventory.json'),
        customers: require('../public/locales/en/customers.json'),
        sales: require('../public/locales/en/sales.json'),
        quotations: require('../public/locales/en/quotations.json'),
        invoices: require('../public/locales/en/invoices.json'),
        vendors: require('../public/locales/en/vendors.json'),
        admin: require('../public/locales/en/admin.json'),
        tips: require('../public/locales/en/tips.json')
      },
      ar: {
        common: require('../public/locales/ar/common.json'),
        app: require('../public/locales/ar/app.json'),
        auth: require('../public/locales/ar/auth.json'),
        dashboard: require('../public/locales/ar/dashboard.json'),
        inventory: require('../public/locales/ar/inventory.json'),
        customers: require('../public/locales/ar/customers.json'),
        sales: require('../public/locales/ar/sales.json'),
        quotations: require('../public/locales/ar/quotations.json'),
        invoices: require('../public/locales/ar/invoices.json'),
        vendors: require('../public/locales/ar/vendors.json'),
        admin: require('../public/locales/ar/admin.json'),
        tips: require('../public/locales/ar/tips.json')
      }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'ar'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

// Initialize language direction based on stored preference or detected language
const updateDocumentLanguage = (language: string) => {
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
};

// Set initial direction
const currentLanguage = localStorage.getItem('preferredLanguage') || i18n.language || 'en';
updateDocumentLanguage(currentLanguage);

// Also listen for language changes
i18n.on('languageChanged', (lang) => {
  updateDocumentLanguage(lang);
});

export default i18n;
