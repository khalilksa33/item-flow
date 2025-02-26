
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

import dashboardEN from '../public/locales/en/dashboard.json';
import dashboardAR from '../public/locales/ar/dashboard.json';

import customersEN from '../public/locales/en/customers.json';
import customersAR from '../public/locales/ar/customers.json';

import salesEN from '../public/locales/en/sales.json';
import salesAR from '../public/locales/ar/sales.json';

import quotationsEN from '../public/locales/en/quotations.json';
import quotationsAR from '../public/locales/ar/quotations.json';

import invoicesEN from '../public/locales/en/invoices.json';
import invoicesAR from '../public/locales/ar/invoices.json';

import vendorsEN from '../public/locales/en/vendors.json';
import vendorsAR from '../public/locales/ar/vendors.json';

import adminEN from '../public/locales/en/admin.json';
import adminAR from '../public/locales/ar/admin.json';

import tipsEN from '../public/locales/en/tips.json';
import tipsAR from '../public/locales/ar/tips.json';

import authEN from '../public/locales/en/auth.json';
import authAR from '../public/locales/ar/auth.json';

// the translations
const resources = {
  en: {
    translation: translationEN,
    inventory: inventoryEN,
    app: appEN,
    common: commonEN,
    dashboard: dashboardEN,
    customers: customersEN,
    sales: salesEN,
    quotations: quotationsEN,
    invoices: invoicesEN,
    vendors: vendorsEN,
    admin: adminEN,
    tips: tipsEN,
    auth: authEN
  },
  ar: {
    translation: translationAR,
    inventory: inventoryAR,
    app: appAR,
    common: commonAR,
    dashboard: dashboardAR,
    customers: customersAR,
    sales: salesAR,
    quotations: quotationsAR,
    invoices: invoicesAR,
    vendors: vendorsAR,
    admin: adminAR,
    tips: tipsAR,
    auth: authAR
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
    debug: true, // Enable debug to see what's happening
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
