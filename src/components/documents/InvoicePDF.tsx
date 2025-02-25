
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@/types/inventory';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { marginBottom: 20 },
  title: { fontSize: 24, marginBottom: 10 },
  info: { marginBottom: 20 },
  table: { marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', padding: 5 },
  tableHeader: { fontWeight: 'bold' },
  tableCell: { flex: 1 },
  totals: { marginTop: 20, alignItems: 'flex-end' },
});

interface InvoicePDFProps {
  invoice: Invoice;
  customerName: string;
}

export const InvoicePDF = ({ invoice, customerName }: InvoicePDFProps) => {
  // Add safe number formatting helper
  const formatNumber = (value: number | undefined) => {
    return (value ?? 0).toFixed(2);
  };

  // Ensure items array exists
  const items = invoice.items || [];
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text>Date: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
          <Text>Due Date: {new Date(invoice.paymentDue).toLocaleDateString()}</Text>
        </View>

        <View style={styles.info}>
          <Text>Customer: {customerName}</Text>
          {invoice.paymentTerms && <Text>Payment Terms: {invoice.paymentTerms}</Text>}
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Item</Text>
            <Text style={styles.tableCell}>Quantity</Text>
            <Text style={styles.tableCell}>Unit Price</Text>
            <Text style={styles.tableCell}>Subtotal</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.productId}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>${formatNumber(item.unitPrice)}</Text>
              <Text style={styles.tableCell}>${formatNumber(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <Text>Subtotal: ${formatNumber(invoice.subtotal)}</Text>
          <Text>VAT ({((invoice.vatRate ?? 0) * 100).toFixed()}%): ${formatNumber(invoice.vatAmount)}</Text>
          <Text>Total: ${formatNumber(invoice.total)}</Text>
        </View>

        {invoice.notes && (
          <View style={{ marginTop: 20 }}>
            <Text>Notes: {invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};
