
/**
 * Utility functions for formatting data in printed documents
 */

/**
 * Format currency display based on language direction
 */
export const formatCurrency = (
  amount: number, 
  currency: string, 
  isRTL: boolean
): string => {
  return isRTL 
    ? `${amount.toFixed(2)} ${currency}` 
    : `${currency} ${amount.toFixed(2)}`;
};

/**
 * Get document direction based on language
 */
export const getDocumentDirection = (isRTL: boolean): { dir: string; lang: string } => {
  return {
    dir: isRTL ? 'rtl' : 'ltr',
    lang: isRTL ? 'ar' : 'en'
  };
};

/**
 * Format a date according to the current locale
 */
export const formatDate = (dateString: string, isRTL: boolean): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Apply language settings to localStorage and document
 */
export const applyLanguageSettings = (isRTL: boolean): void => {
  // Force language setting in localStorage
  localStorage.setItem('preferredLanguage', isRTL ? 'ar' : 'en');
  console.log(`Setting document language: ${isRTL ? 'ar' : 'en'}, isRTL: ${isRTL}`);

  // Force document direction
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = isRTL ? 'ar' : 'en';
};
