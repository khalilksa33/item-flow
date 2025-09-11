
export const formatUtils = {
  formatDate: (dateString: string, language: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(language, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  },

  formatCurrency: (amount: number, isRTL: boolean): string => {
    const currency = localStorage.getItem('currency') || 'SAR';
    const symbol = currency === 'SAR' ? 'ر.س' : currency;
    return `${amount.toFixed(2)} ${symbol}`;
  }
};
