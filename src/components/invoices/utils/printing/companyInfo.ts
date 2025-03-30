
/**
 * Utility to retrieve company information from localStorage
 */

interface CompanyInfo {
  companyName: string;
  vatNumber: string;
  crNumber: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo: string;
  currency: string;
}

/**
 * Get company information from localStorage
 */
export const getCompanyInfo = (): CompanyInfo => {
  return {
    companyName: localStorage.getItem('companyName') || '',
    vatNumber: localStorage.getItem('vatNumber') || '',
    crNumber: localStorage.getItem('crNumber') || '',
    companyAddress: localStorage.getItem('companyAddress') || '',
    companyPhone: localStorage.getItem('companyPhone') || '',
    companyEmail: localStorage.getItem('companyEmail') || '',
    companyLogo: localStorage.getItem('companyLogo') || '',
    currency: localStorage.getItem('currency') || 'SAR',
  };
};
