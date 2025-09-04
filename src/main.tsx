
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Set initial language and document direction
const storedLanguage = localStorage.getItem('preferredLanguage');
if (storedLanguage) {
  console.log(`Main: Initializing with stored language: ${storedLanguage}`);
  document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = storedLanguage;
  if (storedLanguage === 'ar') {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
}

// Handle language changes from localStorage
window.addEventListener('storage', (event) => {
  if (event.key === 'preferredLanguage') {
    const newLang = event.newValue || 'en';
    console.log(`Main: Language changed in storage: ${newLang}`);
    
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
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find root element');
}
