
import { Document, Page, View, Text } from '@react-pdf/renderer';
import { Invoice } from '@/types/inventory';
import { styles } from './pdf/styles';
import { InvoiceHeader } from './pdf/InvoiceHeader';
import { InvoiceInfo } from './pdf/InvoiceInfo';
import { InvoiceItemsTable } from './pdf/InvoiceItemsTable';
import { InvoiceTotals } from './pdf/InvoiceTotals';
import { InvoiceFooter } from './pdf/InvoiceFooter';

interface InvoicePDFProps {
  invoice: Invoice;
  customerName: string;
}

export const InvoicePDF = ({ invoice, customerName }: InvoicePDFProps) => {
  // Always check localStorage directly for language settings to ensure consistency
  const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
  const isRTL = currentLanguage === 'ar';
  
  // Get company info from local storage
  const companyName = localStorage.getItem('companyName') || '';
  const vatNumber = localStorage.getItem('vatNumber') || '';
  const crNumber = localStorage.getItem('crNumber') || '';
  const companyAddress = localStorage.getItem('companyAddress') || '';
  const companyPhone = localStorage.getItem('companyPhone') || '';
  const companyEmail = localStorage.getItem('companyEmail') || '';
  const companyLogo = localStorage.getItem('companyLogo') || '';
  const currency = localStorage.getItem('currency') || 'SAR';

  // Generate QR code URL with proper encoding
  const qrCodeData = `INV:${invoice.id}|VAT:${vatNumber}|DATE:${invoice.createdAt}|TOTAL:${invoice.total}|TAX:${invoice.vatAmount}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeData)}`;

  // Format numbers for display
  const formatNumber = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return "0.00";
    }
    return value.toFixed(2);
  };

  // Format dates according to locale
  const formatDate = (dateString: string) => {
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

  // Invoice reference number
  const invoiceRef = isRTL 
    ? `فاتورة-${invoice.id.slice(0, 8).toUpperCase()}`
    : `INV-${invoice.id.slice(0, 8).toUpperCase()}`;
  
  // Hardcoded labels for Arabic and English to ensure proper rendering in PDF
  const labels = isRTL ? {
    invoice: "فاتورة",
    reference: "المرجع",
    date: "التاريخ",
    dueDate: "تاريخ الاستحقاق",
    paymentTerms: "شروط الدفع",
    billTo: "فاتورة إلى",
    items: "عناصر الفاتورة",
    item: "العنصر",
    quantity: "الكمية",
    unitPrice: "سعر الوحدة",
    subtotal: "المجموع الفرعي",
    vat: "ضريبة القيمة المضافة",
    total: "المجموع",
    notes: "ملاحظات",
    thankYou: "شكرًا لعملك معنا!",
    generatedOn: "تم إنشاؤها في",
    paid: "مدفوع",
    vatNumber: "رقم ضريبة القيمة المضافة",
    crNumber: "رقم السجل التجاري",
    address: "العنوان",
    phone: "الهاتف",
    email: "البريد الإلكتروني"
  } : {
    invoice: "Invoice",
    reference: "Reference",
    date: "Date",
    dueDate: "Due Date",
    paymentTerms: "Payment Terms",
    billTo: "Bill To",
    items: "Invoice Items",
    item: "Item",
    quantity: "Quantity",
    unitPrice: "Unit Price",
    subtotal: "Subtotal",
    vat: "VAT",
    total: "Total",
    notes: "Notes",
    thankYou: "Thank you for your business!",
    generatedOn: "Generated on",
    paid: "PAID",
    vatNumber: "VAT Number",
    crNumber: "CR Number",
    address: "Address",
    phone: "Phone",
    email: "Email"
  };

  return (
    <Document>
      <Page size="A4" style={[styles.page, isRTL && styles.rtl]}>
        {/* Paid Watermark if applicable */}
        {invoice.status === 'paid' && (
          <Text style={styles.watermark}>{labels.paid}</Text>
        )}

        <InvoiceHeader
          companyName={companyName}
          vatNumber={vatNumber}
          crNumber={crNumber}
          companyAddress={companyAddress}
          companyPhone={companyPhone}
          companyEmail={companyEmail}
          companyLogo={companyLogo}
          qrCodeUrl={qrCodeUrl}
          isRTL={isRTL}
          labels={labels}
        />

        <InvoiceInfo
          invoiceRef={invoiceRef}
          createdAt={invoice.createdAt}
          paymentDue={invoice.paymentDue}
          paymentTerms={invoice.paymentTerms}
          customerName={customerName}
          formatDate={formatDate}
          isRTL={isRTL}
          labels={labels}
        />

        <InvoiceItemsTable
          items={invoice.items || []}
          currency={currency}
          formatNumber={formatNumber}
          isRTL={isRTL}
          labels={labels}
        />

        <InvoiceTotals
          subtotal={invoice.subtotal}
          vatRate={invoice.vatRate ?? 0}
          vatAmount={invoice.vatAmount}
          total={invoice.total}
          currency={currency}
          formatNumber={formatNumber}
          isRTL={isRTL}
          labels={labels}
        />

        <InvoiceFooter
          companyName={companyName}
          companyPhone={companyPhone}
          notes={invoice.notes}
          status={invoice.status}
          isRTL={isRTL}
          labels={labels}
        />
      </Page>
    </Document>
  );
};
