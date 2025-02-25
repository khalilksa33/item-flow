
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@/types/inventory';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  header: { marginBottom: 10, alignItems: 'center' },
  title: { fontSize: 16, marginBottom: 5 },
  info: { marginBottom: 10 },
  table: { marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', padding: 3 },
  tableCell: { flex: 1 },
  totals: { marginTop: 10, alignItems: 'flex-end' },
  signature: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
  signatureLine: { width: 150, borderTopWidth: 1, borderColor: '#000', marginTop: 20 },
});

interface ReceiptPDFProps {
  invoice: Invoice;
  customerName: string;
  paymentMethod?: string;
}

export const ReceiptPDF = ({ invoice, customerName, paymentMethod }: ReceiptPDFProps) => (
  <Document>
    <Page size="A6" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Cash Receipt</Text>
        <Text>Receipt No: {invoice.id.slice(0, 8)}</Text>
        <Text>Date: {new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.info}>
        <Text>Received from: {customerName}</Text>
        <Text>Payment Method: {paymentMethod || 'Cash'}</Text>
        <Text>Invoice Reference: {invoice.id}</Text>
      </View>

      <View style={styles.totals}>
        <Text>Amount Received: ${invoice.total.toFixed(2)}</Text>
        <Text>Amount in Words: [Amount in words]</Text>
      </View>

      <View style={styles.signature}>
        <View>
          <View style={styles.signatureLine} />
          <Text>Received By</Text>
        </View>
        <View>
          <View style={styles.signatureLine} />
          <Text>Customer Signature</Text>
        </View>
      </View>
    </Page>
  </Document>
);
