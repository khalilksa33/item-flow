
import { Document, Page, View, Text } from '@react-pdf/renderer';
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
  // Force the language based on current i18n settings for consistent rendering
  const currentLanguage = i18n.language;
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
    return (value ?? 0).toFixed(2);
  };

  // Format dates according to locale
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Invoice reference number
  const invoiceRef = `INV-${invoice.id.slice(0, 8).toUpperCase()}`;

  return (
    <Document>
      <Page size="A4" style={[styles.page, isRTL && styles.rtl]}>
        {/* Paid Watermark if applicable */}
        {invoice.status === 'paid' && (
          <Text style={styles.watermark}>{isRTL ? 'مدفوع' : 'PAID'}</Text>
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
        />

        <InvoiceInfo
          invoiceRef={invoiceRef}
          createdAt={invoice.createdAt}
          paymentDue={invoice.paymentDue}
          paymentTerms={invoice.paymentTerms}
          customerName={customerName}
          formatDate={formatDate}
          isRTL={isRTL}
        />

        <InvoiceItemsTable
          items={invoice.items || []}
          currency={currency}
          formatNumber={formatNumber}
          isRTL={isRTL}
        />

        <InvoiceTotals
          subtotal={invoice.subtotal}
          vatRate={invoice.vatRate ?? 0}
          vatAmount={invoice.vatAmount}
          total={invoice.total}
          currency={currency}
          formatNumber={formatNumber}
          isRTL={isRTL}
        />

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
