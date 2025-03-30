
import { Invoice } from "@/types/inventory";
import { formatCurrency, formatDate, getDocumentDirection } from "./formatUtils";
import { getDocumentLabels } from "./labels";
import { getCompanyInfo } from "./companyInfo";

/**
 * Convert number to words function for Arabic and English
 */
const convertToWords = (amount: number, isRTL: boolean): string => {
  if (isRTL) {
    // Simple Arabic implementation
    if (amount === 0) return "صفر";
    return `${amount.toFixed(2)} (بالأرقام فقط)`;
  } else {
    // Simple English implementation
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (amount < 10) return units[Math.floor(amount)] + " only";
    if (amount < 20) return teens[Math.floor(amount) - 10] + " only";
    if (amount < 100) return tens[Math.floor(amount / 10)] + (amount % 10 ? ' ' + units[Math.floor(amount % 10)] : '') + " only";
    
    return amount.toFixed(2) + " (in figures only)";
  }
};

/**
 * Generate HTML content for receipt printing
 */
export const generateReceiptHTML = (
  invoice: Invoice, 
  customerName: string, 
  isRTL: boolean,
  paymentMethod?: string
): string => {
  const { dir, lang } = getDocumentDirection(isRTL);
  const companyInfo = getCompanyInfo();
  const labels = getDocumentLabels(isRTL).receipt;
  
  // Format currency for display
  const formatCurrencyValue = (amount: number) => formatCurrency(amount, companyInfo.currency, isRTL);

  // Receipt number
  const receiptNo = isRTL 
    ? `إيصال-${invoice.id.slice(0, 8)}`
    : `REC-${invoice.id.slice(0, 8)}`;

  // Invoice reference
  const invoiceRef = isRTL 
    ? `فاتورة-${invoice.id.slice(0, 8)}`
    : `INV-${invoice.id.slice(0, 8)}`;

  return `
    <!DOCTYPE html>
    <html lang="${lang}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <title>${labels.receipt} - ${invoice.id.slice(0, 8)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo'" : "'Arial'"}, sans-serif;
          margin: 0;
          padding: 20px;
          direction: ${dir};
          text-align: ${isRTL ? 'right' : 'left'};
        }
        .receipt-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #eee;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .receipt-details {
          margin-bottom: 20px;
        }
        .detail-row {
          margin-bottom: 5px;
        }
        .amount {
          margin-top: 15px;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }
        .signatures {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          flex-direction: ${isRTL ? 'row-reverse' : 'row'};
        }
        .signature {
          text-align: center;
        }
        .signature-line {
          width: 150px;
          border-top: 1px solid #000;
          margin: 0 auto;
          margin-bottom: 5px;
        }
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 80px;
          opacity: 0.1;
          color: #000;
          z-index: -1;
        }
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        ${invoice.status === 'paid' ? `<div class="watermark">${labels.paid}</div>` : ''}
        <div class="header">
          <div class="title">${labels.receipt}</div>
          <div>${labels.receiptNo}: ${receiptNo}</div>
          <div>${labels.date}: ${formatDate(new Date().toISOString(), isRTL)}</div>
        </div>
        
        <div class="receipt-details">
          <div class="detail-row">${labels.receivedFrom}: ${customerName}</div>
          <div class="detail-row">${labels.paymentMethod}: ${paymentMethod || labels.cash}</div>
          <div class="detail-row">${labels.invoiceReference}: ${invoiceRef}</div>
        </div>
        
        <div class="amount">
          <div>${labels.amountReceived}: ${formatCurrencyValue(invoice.total)}</div>
          <div>${labels.amountInWords}: ${convertToWords(invoice.total, isRTL)}</div>
        </div>
        
        <div class="signatures">
          <div class="signature">
            <div class="signature-line"></div>
            <div>${labels.receivedBy}</div>
          </div>
          <div class="signature">
            <div class="signature-line"></div>
            <div>${labels.customerSignature}</div>
          </div>
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print(); setTimeout(() => window.close(), 1000);">
          ${isRTL ? 'طباعة' : 'Print'}
        </button>
      </div>
    </body>
    </html>
  `;
};
