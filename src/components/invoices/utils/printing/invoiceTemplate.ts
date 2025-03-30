
import { Invoice } from "@/types/inventory";
import { formatCurrency, formatDate, getDocumentDirection } from "./formatUtils";
import { getCompanyInfo } from "./companyInfo";
import { getDocumentLabels } from "./labels";

/**
 * Generate HTML content for invoice printing
 */
export const generateInvoiceHTML = (
  invoice: Invoice, 
  customerName: string, 
  isRTL: boolean
): string => {
  const { dir, lang } = getDocumentDirection(isRTL);
  const companyInfo = getCompanyInfo();
  const labels = getDocumentLabels(isRTL).invoice;
  
  // Format currency for display
  const formatCurrencyValue = (amount: number) => formatCurrency(amount, companyInfo.currency, isRTL);

  // Generate invoice reference
  const invoiceRef = isRTL 
    ? `فاتورة-${invoice.id.slice(0, 8)}` 
    : `INV-${invoice.id.slice(0, 8)}`;

  return `
    <!DOCTYPE html>
    <html lang="${lang}" dir="${dir}">
    <head>
      <meta charset="UTF-8">
      <title>${labels.invoice} - ${invoice.id.slice(0, 8)}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
        
        body {
          font-family: ${isRTL ? "'Cairo'" : "'Arial'"}, sans-serif;
          margin: 0;
          padding: 20px;
          direction: ${dir};
          text-align: ${isRTL ? 'right' : 'left'};
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #eee;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-direction: ${isRTL ? 'row-reverse' : 'row'};
        }
        .company-info h2 {
          margin-top: 0;
          margin-bottom: 10px;
        }
        .logo {
          max-height: 100px;
          max-width: 200px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }
        .invoice-details {
          margin-bottom: 20px;
        }
        .invoice-details-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          flex-direction: ${isRTL ? 'row-reverse' : 'row'};
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .table th, .table td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: ${isRTL ? 'right' : 'left'};
        }
        .table th {
          background-color: #f0f0f0;
        }
        .totals {
          margin-top: 20px;
          margin-left: auto;
          margin-right: ${isRTL ? 'auto' : '0'};
          max-width: 300px;
          text-align: ${isRTL ? 'left' : 'right'};
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          flex-direction: ${isRTL ? 'row-reverse' : 'row'};
        }
        .grand-total {
          font-weight: bold;
          border-top: 1px solid #ddd;
          padding-top: 5px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
        }
        .footer-company {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .footer-address {
          margin-bottom: 5px;
        }
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
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
      <div class="invoice-container">
        ${invoice.status === 'paid' ? `<div class="watermark">${labels.paid}</div>` : ''}
        <div class="header">
          <div class="company-info">
            ${companyInfo.companyName ? `<h2>${companyInfo.companyName}</h2>` : ''}
            ${companyInfo.vatNumber ? `<p>${labels.vatNumber}: ${companyInfo.vatNumber}</p>` : ''}
          </div>
          ${companyInfo.companyLogo ? `<img src="${companyInfo.companyLogo}" class="logo" />` : ''}
        </div>
        <div class="title">
          ${labels.invoice}
        </div>
        <div class="invoice-details">
          <div class="invoice-details-row">
            <div><strong>${labels.reference}:</strong> ${invoiceRef}</div>
            <div><strong>${labels.date}:</strong> ${formatDate(invoice.createdAt, isRTL)}</div>
          </div>
          <div class="invoice-details-row">
            <div><strong>${labels.billTo}:</strong> ${customerName}</div>
            <div><strong>${labels.dueDate}:</strong> ${formatDate(invoice.paymentDue, isRTL)}</div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>${labels.item}</th>
              <th>${labels.quantity}</th>
              <th>${labels.unitPrice}</th>
              <th>${labels.subtotal}</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.productId}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrencyValue(item.unitPrice)}</td>
                <td>${formatCurrencyValue(item.subtotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="totals">
          <div class="total-row">
            <div>${labels.subtotal}:</div>
            <div>${formatCurrencyValue(invoice.subtotal)}</div>
          </div>
          <div class="total-row">
            <div>${labels.vat} (${(invoice.vatRate * 100).toFixed()}%):</div>
            <div>${formatCurrencyValue(invoice.vatAmount)}</div>
          </div>
          <div class="total-row grand-total">
            <div>${labels.total}:</div>
            <div>${formatCurrencyValue(invoice.total)}</div>
          </div>
        </div>
        <div class="footer">
          <p>${labels.thankYou}</p>
          ${companyInfo.companyAddress ? `<p class="footer-address">${companyInfo.companyAddress}</p>` : ''}
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
