
import { Invoice } from "@/types/inventory";
import { formatCurrency, formatDate, getDocumentDirection } from "./formatUtils";
import { getCompanyInfo } from "./companyInfo";
import { getDocumentLabels } from "./labels";
import { storage } from "@/lib/storage";

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

  // Generate QR code for invoice
  const qrCodeData = `INV:${invoice.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrCodeData)}`;

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
          position: relative;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          flex-direction: ${isRTL ? 'row-reverse' : 'row'};
        }
        .company-info {
          flex: 1;
          ${isRTL ? 'text-align: right;' : 'text-align: left;'}
        }
        .company-info h2 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: bold;
        }
        .company-info p {
          margin: 3px 0;
          font-size: 12px;
          color: #555;
        }
        .logo-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          flex-direction: column;
        }
        .logo {
          max-height: 80px;
          max-width: 150px;
          object-fit: contain;
          margin-bottom: 10px;
        }
        .address-container {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          flex-direction: column;
          padding: 0 20px;
        }
        .address-container p {
          margin: 2px 0;
          font-size: 11px;
          color: #666;
        }
        .qr-container {
          flex: 1;
          display: flex;
          justify-content: ${isRTL ? 'flex-start' : 'flex-end'};
          align-items: flex-start;
          flex-direction: column;
        }
        .qr-code {
          width: 80px;
          height: 80px;
          border: 1px solid #ddd;
        }
        .qr-label {
          font-size: 8px;
          margin-top: 5px;
          text-align: center;
          color: #666;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
          color: #333;
        }
        .invoice-details {
          margin-bottom: 20px;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
        }
        .invoice-details-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          flex-direction: ${isRTL ? 'row-reverse' : 'row'};
        }
        .invoice-details-row strong {
          color: #333;
        }
        .table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          border: 1px solid #ddd;
        }
        .table th, .table td {
          border: 1px solid #ddd;
          padding: 10px 8px;
          text-align: ${isRTL ? 'right' : 'left'};
          font-size: 11px;
        }
        .table th {
          background-color: #f5f5f5;
          font-weight: bold;
          text-align: center;
        }
        .table td:first-child, .table th:first-child {
          text-align: center;
          width: 5%;
        }
        .table td:nth-child(2), .table th:nth-child(2) {
          width: 12%;
        }
        .table td:nth-child(3), .table th:nth-child(3) {
          width: 25%;
        }
        .table td:nth-child(4), .table th:nth-child(4) {
          text-align: center;
          width: 8%;
        }
        .table td:nth-child(5), .table th:nth-child(5) {
          text-align: center;
          width: 12%;
        }
        .table td:nth-child(6), .table th:nth-child(6) {
          text-align: center;
          width: 12%;
        }
        .table td:nth-child(7), .table th:nth-child(7) {
          text-align: center;
          width: 12%;
        }
        .table td:nth-child(8), .table th:nth-child(8) {
          text-align: center;
          width: 14%;
        }
        .totals {
          margin-top: 20px;
          margin-${isRTL ? 'right' : 'left'}: auto;
          max-width: 300px;
          text-align: ${isRTL ? 'left' : 'right'};
          background: #f9f9f9;
          padding: 15px;
          border-radius: 5px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          flex-direction: ${isRTL ? 'row-reverse' : 'row'};
          padding: 3px 0;
        }
        .total-row .label {
          font-weight: bold;
          color: #555;
        }
        .total-row .value {
          font-weight: bold;
          color: #333;
        }
        .grand-total {
          border-top: 2px solid #333;
          padding-top: 8px;
          margin-top: 8px;
        }
        .grand-total .label,
        .grand-total .value {
          font-size: 14px;
          color: #000;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        .footer-company {
          font-weight: bold;
          margin-bottom: 5px;
          font-size: 12px;
        }
        .footer-address {
          margin-bottom: 5px;
          font-size: 10px;
          color: #666;
        }
        .thank-you {
          font-style: italic;
          color: #666;
          margin-bottom: 10px;
        }
        .watermark {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 80px;
          opacity: 0.1;
          color: #000;
          z-index: -1;
          font-weight: bold;
        }
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none;
          }
          .invoice-container {
            border: none;
            box-shadow: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        ${invoice.status === 'paid' ? `<div class="watermark">${labels.paid}</div>` : ''}
        
        <div class="header">
          <div class="qr-container">
            <img src="${qrCodeUrl}" class="qr-code" alt="QR Code" />
            <div class="qr-label">${isRTL ? 'رمز الاستجابة السريعة' : 'QR Code'}</div>
          </div>
          
          <div class="company-info">
            ${companyInfo.companyName ? `<h2>${companyInfo.companyName}</h2>` : ''}
            ${companyInfo.vatNumber ? `<p><strong>${labels.vatNumber}:</strong> ${companyInfo.vatNumber}</p>` : ''}
            ${companyInfo.crNumber ? `<p><strong>${labels.crNumber}:</strong> ${companyInfo.crNumber}</p>` : ''}
            ${companyInfo.companyPhone ? `<p><strong>${labels.phone}:</strong> ${companyInfo.companyPhone}</p>` : ''}
            ${companyInfo.companyEmail ? `<p><strong>${labels.email}:</strong> ${companyInfo.companyEmail}</p>` : ''}
          </div>
          
          <div class="logo-container">
            ${companyInfo.companyLogo ? `<img src="${companyInfo.companyLogo}" class="logo" alt="Company Logo" />` : ''}
          </div>
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
              <th>${isRTL ? 'كود الصنف' : 'Item Code'}</th>
              <th>${labels.item}</th>
              <th>${labels.quantity}</th>
              <th>${labels.unitPrice}</th>
              <th>${isRTL ? 'قيمة ضريبة القيمة المضافة للوحدة (15%)' : '15% VAT per Unit'}</th>
              <th>${isRTL ? 'إجمالي قيمة الضريبة' : 'Total VAT Value'}</th>
              <th>${labels.subtotal}</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map((item, index) => {
              const product = storage.getItems().find(p => p.id === item.productId);
              const VAT_RATE = 0.15;
              const vatPerUnit = item.unitPrice * VAT_RATE;
              const totalVatValue = vatPerUnit * item.quantity;
              
              return `
              <tr>
                <td>${index + 1}</td>
                <td>${product?.barcode || item.productId.slice(0, 8)}</td>
                <td>${product?.name || item.productId}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrencyValue(item.unitPrice)}</td>
                <td>${formatCurrencyValue(vatPerUnit)}</td>
                <td>${formatCurrencyValue(totalVatValue)}</td>
                <td>${formatCurrencyValue(item.subtotal)}</td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-row">
            <div class="label">${labels.subtotal}:</div>
            <div class="value">${formatCurrencyValue(invoice.subtotal)}</div>
          </div>
          <div class="total-row">
            <div class="label">${labels.vat} (${(invoice.vatRate * 100).toFixed()}%):</div>
            <div class="value">${formatCurrencyValue(invoice.vatAmount)}</div>
          </div>
          <div class="total-row grand-total">
            <div class="label">${labels.total}:</div>
            <div class="value">${formatCurrencyValue(invoice.total)}</div>
          </div>
        </div>
        
        <div class="footer">
          <div class="thank-you">
            <p>${labels.thankYou}</p>
          </div>
          ${companyInfo.companyAddress ? `<p class="footer-address">${companyInfo.companyAddress}</p>` : ''}
        </div>
      </div>
      
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print(); setTimeout(() => window.close(), 1000);" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
          ${isRTL ? 'طباعة' : 'Print'}
        </button>
      </div>
    </body>
    </html>
  `;
};
