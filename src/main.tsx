
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import i18n from './i18n';

// Initialize language before rendering
const storedLanguage = localStorage.getItem('preferredLanguage');
if (storedLanguage) {
  i18n.changeLanguage(storedLanguage);
  document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = storedLanguage;
  if (storedLanguage === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
