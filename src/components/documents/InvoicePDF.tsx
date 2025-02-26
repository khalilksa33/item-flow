
import { Document, Page, View } from '@react-pdf/renderer';
import { Invoice } from '@/types/inventory';
import { styles } from './pdf/styles';
import { InvoiceHeader } from './pdf/InvoiceHeader';
import { InvoiceInfo } from './pdf/InvoiceInfo';
import { InvoiceItemsTable } from './pdf/InvoiceItemsTable';
import { InvoiceTotals } from './pdf/InvoiceTotals';
import { InvoiceFooter } from './pdf/InvoiceFooter';
import i18n from '@/i18n';

interface InvoicePDFProps {
  invoice: Invoice;
  customerName: string;
}

export const InvoicePDF = ({ invoice, customerName }: InvoicePDFProps) => {
  // Get current language
  const isRTL = i18n.language === 'ar';
  
  // Get company info from local storage
  const companyName = localStorage.getItem('companyName') || 'Company Name';
  const vatNumber = localStorage.getItem('vatNumber') || '';
  const crNumber = localStorage.getItem('crNumber') || '';
  const companyAddress = localStorage.getItem('companyAddress') || '';
  const companyPhone = localStorage.getItem('companyPhone') || '';
  const companyEmail = localStorage.getItem('companyEmail') || '';
  const currency = localStorage.getItem('currency') || 'USD';
  const companyLogo = localStorage.getItem('companyLogo') || '';

  // Generate QR code URL with proper encoding
  const qrCodeData = `INV:${invoice.id}|COMP:${encodeURIComponent(companyName)}|CUST:${encodeURIComponent(customerName)}|AMT:${invoice.total}`;
  // Use a reliable QR code service
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeData)}`;

  // Add safe number formatting helper
  const formatNumber = (value: number | undefined) => {
    return (value ?? 0).toFixed(2);
  };

  // Ensure items array exists
  const items = invoice.items || [];
  
  // Format dates
  const dateFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  } as Intl.DateTimeFormatOptions;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', dateFormatOptions);
  };

  // Generate invoice reference number
  const invoiceRef = `INV-${invoice.id.slice(0, 8).toUpperCase()}`;
  
  return (
    <Document>
      <Page size="A4" style={[styles.page, isRTL && styles.rtl]}>
        {/* Header Section */}
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
        />

        {/* Title and Invoice Info */}
        <InvoiceInfo
          invoiceRef={invoiceRef}
          createdAt={invoice.createdAt}
          paymentDue={invoice.paymentDue}
          paymentTerms={invoice.paymentTerms}
          customerName={customerName}
          formatDate={formatDate}
          isRTL={isRTL}
        />

        {/* Items Table */}
        <InvoiceItemsTable
          items={items}
          currency={currency}
          formatNumber={formatNumber}
          isRTL={isRTL}
        />

        {/* Totals Section */}
        <InvoiceTotals
          subtotal={invoice.subtotal}
          vatRate={invoice.vatRate ?? 0}
          vatAmount={invoice.vatAmount}
          total={invoice.total}
          currency={currency}
          formatNumber={formatNumber}
          isRTL={isRTL}
        />

        {/* Footer Sections */}
        <InvoiceFooter
          companyName={companyName}
          companyAddress={companyAddress}
          companyPhone={companyPhone}
          notes={invoice.notes}
          status={invoice.status}
          isRTL={isRTL}
        />
      </Page>
    </Document>
  );
};
