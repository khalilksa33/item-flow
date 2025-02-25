
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Quotation } from '@/types/inventory';

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

interface QuotationPDFProps {
  quotation: Quotation;
  customerName: string;
}

export const QuotationPDF = ({ quotation, customerName }: QuotationPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Quotation</Text>
        <Text>Date: {new Date(quotation.createdAt).toLocaleDateString()}</Text>
        <Text>Valid Until: {new Date(quotation.validUntil).toLocaleDateString()}</Text>
      </View>

      <View style={styles.info}>
        <Text>Customer: {customerName}</Text>
        {quotation.terms && <Text>Terms: {quotation.terms}</Text>}
      </View>

      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Item</Text>
          <Text style={styles.tableCell}>Quantity</Text>
          <Text style={styles.tableCell}>Unit Price</Text>
          <Text style={styles.tableCell}>Subtotal</Text>
        </View>
        {quotation.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.productId}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>${item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.tableCell}>${item.subtotal.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <Text>Subtotal: ${quotation.subtotal.toFixed(2)}</Text>
        <Text>VAT ({(quotation.vatRate * 100).toFixed()}%): ${quotation.vatAmount.toFixed(2)}</Text>
        <Text>Total: ${quotation.total.toFixed(2)}</Text>
      </View>

      {quotation.notes && (
        <View style={{ marginTop: 20 }}>
          <Text>Notes: {quotation.notes}</Text>
        </View>
      )}
    </Page>
  </Document>
);
