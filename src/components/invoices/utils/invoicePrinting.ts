
import { Invoice } from "@/types/inventory";
import { toast } from "sonner";

// Create a PDF from a React component without using react-pdf/renderer
export const printDocument = (
  invoice: Invoice, 
  customerName: string, 
  type: "invoice" | "receipt", 
  isRTL: boolean, 
  t: (key: string) => string
) => {
  try {
    // Force language setting in localStorage
    localStorage.setItem('preferredLanguage', isRTL ? 'ar' : 'en');
    console.log(`Printing ${type} with language: ${isRTL ? 'ar' : 'en'}, isRTL: ${isRTL}`);

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
    const vatNumber = localStorage.getItem('vatNumber') || '';
    const companyAddress = localStorage.getItem('companyAddress') || '';
    const currency = localStorage.getItem('currency') || 'SAR';
    
    // Format currency based on language
    const formatCurrency = (amount: number) => {
      return isRTL 
        ? `${amount.toFixed(2)} ${currency}` 
        : `${currency} ${amount.toFixed(2)}`;
    };

    // Set the print page content with appropriate RTL/LTR settings and fonts for Arabic
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="${isRTL ? 'ar' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
      <head>
        <meta charset="UTF-8">
        <title>${type === 'invoice' ? t('invoices:invoice') : t('invoices:receipt')} - ${invoice.id.slice(0, 8)}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
          
          body {
            font-family: ${isRTL ? "'Cairo'" : "'Arial'"}, sans-serif;
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
    `);

    // Document content
    const docContent = `
      <div class="invoice-container">
        ${invoice.status === 'paid' ? `<div class="watermark">${isRTL ? 'مدفوع' : 'PAID'}</div>` : ''}
        <div class="header">
          <div class="company-info">
            ${companyName ? `<h2>${companyName}</h2>` : ''}
            ${vatNumber ? `<p>${isRTL ? 'رقم ضريبة القيمة المضافة' : 'VAT Number'}: ${vatNumber}</p>` : ''}
          </div>
          ${companyLogo ? `<img src="${companyLogo}" class="logo" />` : ''}
        </div>
        <div class="title">
          ${type === 'invoice' ? (isRTL ? 'فاتورة' : 'Invoice') : (isRTL ? 'إيصال نقدي' : 'Receipt')}
        </div>
        <div class="invoice-details">
          <div class="invoice-details-row">
            <div><strong>${isRTL ? 'المرجع' : 'Reference'}:</strong> ${isRTL ? `فاتورة-${invoice.id.slice(0, 8)}` : `INV-${invoice.id.slice(0, 8)}`}</div>
            <div><strong>${isRTL ? 'التاريخ' : 'Date'}:</strong> ${new Date(invoice.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</div>
          </div>
          <div class="invoice-details-row">
            <div><strong>${isRTL ? 'العميل' : 'Customer'}:</strong> ${customerName}</div>
            <div><strong>${isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}:</strong> ${new Date(invoice.paymentDue).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>${isRTL ? 'العنصر' : 'Item'}</th>
              <th>${isRTL ? 'الكمية' : 'Quantity'}</th>
              <th>${isRTL ? 'سعر الوحدة' : 'Unit Price'}</th>
              <th>${isRTL ? 'المجموع الفرعي' : 'Subtotal'}</th>
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
            <div>${isRTL ? 'المجموع الفرعي' : 'Subtotal'}:</div>
            <div>${formatCurrency(invoice.subtotal)}</div>
          </div>
          <div class="total-row">
            <div>${isRTL ? 'ضريبة القيمة المضافة' : 'VAT'} (${(invoice.vatRate * 100).toFixed()}%):</div>
            <div>${formatCurrency(invoice.vatAmount)}</div>
          </div>
          <div class="total-row grand-total">
            <div>${isRTL ? 'المجموع' : 'Total'}:</div>
            <div>${formatCurrency(invoice.total)}</div>
          </div>
        </div>
        <div class="footer">
          <p>${isRTL ? 'شكرًا لعملك معنا!' : 'Thank you for your business!'}</p>
          ${companyName ? `<p class="footer-company">${companyName}</p>` : ''}
          ${companyAddress ? `<p class="footer-address">${isRTL ? 'العنوان' : 'Address'}: ${companyAddress}</p>` : ''}
        </div>
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print(); setTimeout(() => window.close(), 1000);">
          ${isRTL ? 'طباعة' : 'Print'}
        </button>
      </div>
    `;

    printWindow.document.write(docContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    // Trigger print after content is loaded
    printWindow.onload = () => {
      printWindow.focus();
      // Use a slightly longer delay to ensure fonts are loaded
      setTimeout(() => {
        printWindow.print();
      }, 1500);
    };
  } catch (error) {
    console.error('Error printing document:', error);
    toast.error(`Error printing ${type}`);
  }
};
