
import React from 'react';
import ReactDOM from 'react-dom/root';
import App from './App';
import './index.css';
import i18n from './i18n';

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
  
  // Force i18n language to match stored preference
  i18n.changeLanguage(storedLanguage);
}

// Create custom event to notify components of language changes
window.addEventListener('storage', (event) => {
  if (event.key === 'preferredLanguage') {
    const newLang = event.newValue || 'en';
    console.log(`Language changed in storage: ${newLang}`);
    i18n.changeLanguage(newLang);
    
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    if (newLang === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
