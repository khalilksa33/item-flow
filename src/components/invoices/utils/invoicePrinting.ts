
import { Invoice } from "@/types/inventory";
import { jsPDF } from "jspdf";
import { renderToString } from "react-dom/server";
import { toast } from "sonner";
import { InvoicePDF } from "@/components/documents/InvoicePDF";
import { ReceiptPDF } from "@/components/documents/ReceiptPDF";

// Force language setting to be consistent
const getPreferredLanguage = () => {
  return localStorage.getItem('preferredLanguage') || 'en';
};

// Create a PDF from a React component without using react-pdf/renderer
export const printDocument = (
  invoice: Invoice, 
  customerName: string, 
  type: "invoice" | "receipt", 
  isRTL: boolean, 
  t: (key: string) => string
) => {
  try {
    // Explicitly set language in localStorage before printing
    const language = isRTL ? 'ar' : 'en';
    localStorage.setItem('preferredLanguage', language);
    console.log(`Printing ${type} with language: ${language}, isRTL: ${isRTL}`);

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error(t("invoices:popupBlocked"));
      return;
    }

    // Set RTL direction if Arabic
    printWindow.document.dir = isRTL ? 'rtl' : 'ltr';
    printWindow.document.documentElement.lang = isRTL ? 'ar' : 'en';

    // Get company info for the print page
    const companyName = localStorage.getItem('companyName') || '';
    const companyLogo = localStorage.getItem('companyLogo') || '';
    const currency = localStorage.getItem('currency') || 'SAR';
    
    // Format currency based on language
    const formatCurrency = (amount: number) => {
      return isRTL 
        ? `${amount.toFixed(2)} ${currency}` 
        : `${currency} ${amount.toFixed(2)}`;
    };

    // Set the print page content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <title>${type === 'invoice' ? t('invoices:invoice') : t('invoices:receipt')} - ${invoice.id.slice(0, 8)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            direction: ${isRTL ? 'rtl' : 'ltr'};
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
    `);

    // Document content
    const docContent = `
      <div class="invoice-container">
        ${invoice.status === 'paid' ? `<div class="watermark">${isRTL ? 'مدفوع' : 'PAID'}</div>` : ''}
        <div class="header">
          <div>
            ${companyName ? `<h2>${companyName}</h2>` : ''}
          </div>
          ${companyLogo ? `<img src="${companyLogo}" class="logo" />` : ''}
        </div>
        <div class="title">
          ${type === 'invoice' ? t('invoices:invoice') : t('invoices:receipt')}
        </div>
        <div class="invoice-details">
          <div class="invoice-details-row">
            <div><strong>${t('invoices:reference')}:</strong> ${isRTL ? `فاتورة-${invoice.id.slice(0, 8)}` : `INV-${invoice.id.slice(0, 8)}`}</div>
            <div><strong>${t('invoices:date')}:</strong> ${new Date(invoice.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</div>
          </div>
          <div class="invoice-details-row">
            <div><strong>${t('invoices:customerName')}:</strong> ${customerName}</div>
            <div><strong>${t('invoices:dueDate')}:</strong> ${new Date(invoice.paymentDue).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>${t('invoices:item')}</th>
              <th>${t('invoices:quantity')}</th>
              <th>${t('invoices:unitPrice')}</th>
              <th>${t('invoices:subtotal')}</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.productId}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.unitPrice)}</td>
                <td>${formatCurrency(item.subtotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="totals">
          <div class="total-row">
            <div>${t('invoices:subtotal')}:</div>
            <div>${formatCurrency(invoice.subtotal)}</div>
          </div>
          <div class="total-row">
            <div>${t('invoices:vat')} (${(invoice.vatRate * 100).toFixed()}%):</div>
            <div>${formatCurrency(invoice.vatAmount)}</div>
          </div>
          <div class="total-row grand-total">
            <div>${t('invoices:total')}:</div>
            <div>${formatCurrency(invoice.total)}</div>
          </div>
        </div>
        <div class="footer">
          <p>${t('invoices:thankYou')}</p>
        </div>
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print(); window.setTimeout(function() { window.close(); }, 500);">
          ${t('common:print')}
        </button>
      </div>
    `;

    printWindow.document.write(docContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Trigger print after content is loaded
    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 1000);
    };
  } catch (error) {
    console.error('Error printing document:', error);
    toast.error(`Error printing ${type}`);
  }
};
