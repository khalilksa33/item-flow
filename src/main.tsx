
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Force document direction based on stored language before render
const storedLanguage = localStorage.getItem('preferredLanguage');
if (storedLanguage) {
  console.log(`Initializing with stored language: ${storedLanguage}`);
  document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = storedLanguage;
  if (storedLanguage === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
}

// Initialize i18n after React is ready
import('./i18n').then(() => {
  console.log('i18n loaded successfully');
});

// Create custom event to notify components of language changes
window.addEventListener('storage', (event) => {
  if (event.key === 'preferredLanguage') {
    const newLang = event.newValue || 'en';
    console.log(`Language changed in storage: ${newLang}`);
    
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    if (newLang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
});

const rootElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
