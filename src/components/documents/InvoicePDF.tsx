
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Invoice } from '@/types/inventory';

// Define styles with appropriate font sizes
const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontSize: 10, // Default smaller font size
    fontFamily: 'Helvetica',
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1px solid #cccccc',
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  companyName: { 
    fontSize: 16, // Smaller company name size
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companyInfo: { 
    fontSize: 8, // Smaller company info
    color: '#666',
    marginBottom: 2,
  },
  title: { 
    fontSize: 18, // Smaller title
    marginBottom: 10,
    color: '#333',
    textTransform: 'uppercase',
  },
  invoiceInfo: {
    marginBottom: 15,
  },
  invoiceDetail: {
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: { 
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: { 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 25,
    alignItems: 'center',
  },
  tableHeader: { 
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
  },
  tableCell: { 
    flex: 1,
    padding: 5,
    fontSize: 9,
  },
  tableCellNarrow: {
    flex: 0.5,
    padding: 5,
    fontSize: 9,
  },
  tableCellWide: {
    flex: 2,
    padding: 5,
    fontSize: 9,
  },
  totals: { 
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 3,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: 80,
    textAlign: 'right',
  },
  grandTotal: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  notes: {
    marginTop: 20,
    fontSize: 9,
    fontStyle: 'italic',
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderColor: '#cccccc',
    paddingTop: 10,
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  thankYou: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 11,
    color: '#333',
  },
  watermark: {
    position: 'absolute',
    bottom: 200,
    right: 60,
    fontSize: 60,
    color: 'rgba(200, 200, 200, 0.3)',
    transform: 'rotate(-45deg)',
  },
});

interface InvoicePDFProps {
  invoice: Invoice;
  customerName: string;
}

export const InvoicePDF = ({ invoice, customerName }: InvoicePDFProps) => {
  // Get company info from local storage
  const companyName = localStorage.getItem('companyName') || 'Company Name';
  const vatNumber = localStorage.getItem('vatNumber') || '';
  const crNumber = localStorage.getItem('crNumber') || '';
  const companyAddress = localStorage.getItem('companyAddress') || '';
  const companyPhone = localStorage.getItem('companyPhone') || '';
  const companyEmail = localStorage.getItem('companyEmail') || '';
  const currency = localStorage.getItem('currency') || 'USD';

  // Generate QR code URL with proper encoding
  const qrCodeData = `INV:${invoice.id}|COMP:${encodeURIComponent(companyName)}|CUST:${encodeURIComponent(customerName)}|AMT:${invoice.total}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(qrCodeData)}`;

  // Add safe number formatting helper
  const formatNumber = (value: number | undefined) => {
    return (value ?? 0).toFixed(2);
  };

  // Ensure items array exists
  const items = invoice.items || [];
  
  // Format dates
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate invoice reference number
  const invoiceRef = `INV-${invoice.id.slice(0, 8).toUpperCase()}`;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName}>{companyName}</Text>
            {vatNumber && <Text style={styles.companyInfo}>VAT Number: {vatNumber}</Text>}
            {crNumber && <Text style={styles.companyInfo}>CR Number: {crNumber}</Text>}
            {companyAddress && <Text style={styles.companyInfo}>Address: {companyAddress}</Text>}
            {companyPhone && <Text style={styles.companyInfo}>Phone: {companyPhone}</Text>}
            {companyEmail && <Text style={styles.companyInfo}>Email: {companyEmail}</Text>}
          </View>
          <View style={styles.headerRight}>
            <Image style={styles.qrCode} src={qrCodeUrl} />
          </View>
        </View>

        {/* Title and Invoice Info */}
        <View style={styles.invoiceInfo}>
          <Text style={styles.title}>Invoice</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={styles.invoiceDetail}>Reference: {invoiceRef}</Text>
              <Text style={styles.invoiceDetail}>Date: {formatDate(invoice.createdAt)}</Text>
              <Text style={styles.invoiceDetail}>Due Date: {formatDate(invoice.paymentDue)}</Text>
              {invoice.paymentTerms && <Text style={styles.invoiceDetail}>Payment Terms: {invoice.paymentTerms}</Text>}
            </View>
            <View>
              <Text style={styles.sectionTitle}>Bill To:</Text>
              <Text style={styles.invoiceDetail}>{customerName}</Text>
              {/* Add more customer details if available */}
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Invoice Items</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellNarrow}>#</Text>
              <Text style={styles.tableCellWide}>Item</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Unit Price</Text>
              <Text style={styles.tableCell}>Subtotal</Text>
            </View>
            {items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCellNarrow}>{index + 1}</Text>
                <Text style={styles.tableCellWide}>{item.productId}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{currency} {formatNumber(item.unitPrice)}</Text>
                <Text style={styles.tableCell}>{currency} {formatNumber(item.subtotal)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Totals Section */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{currency} {formatNumber(invoice.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT ({((invoice.vatRate ?? 0) * 100).toFixed()}%):</Text>
            <Text style={styles.totalValue}>{currency} {formatNumber(invoice.vatAmount)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>{currency} {formatNumber(invoice.total)}</Text>
          </View>
        </View>

        {/* Notes Section */}
        {invoice.notes && (
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text>{invoice.notes}</Text>
          </View>
        )}

        {/* Thank You Message */}
        <View style={styles.thankYou}>
          <Text>Thank you for your business!</Text>
        </View>

        {/* Subtle Watermark for paid invoices */}
        {invoice.status === 'paid' && (
          <Text style={styles.watermark}>PAID</Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{companyName} • {companyAddress} • {companyPhone}</Text>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};
