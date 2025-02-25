
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

interface InvoiceInfoProps {
  invoiceRef: string;
  createdAt: string;
  paymentDue: string;
  paymentTerms?: string;
  customerName: string;
  formatDate: (dateString: string) => string;
}

export function InvoiceInfo({
  invoiceRef,
  createdAt,
  paymentDue,
  paymentTerms,
  customerName,
  formatDate
}: InvoiceInfoProps) {
  return (
    <View style={styles.invoiceInfo}>
      <Text style={styles.title}>Invoice</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.invoiceDetail}>Reference: {invoiceRef}</Text>
          <Text style={styles.invoiceDetail}>Date: {formatDate(createdAt)}</Text>
          <Text style={styles.invoiceDetail}>Due Date: {formatDate(paymentDue)}</Text>
          {paymentTerms && <Text style={styles.invoiceDetail}>Payment Terms: {paymentTerms}</Text>}
        </View>
        <View>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.invoiceDetail}>{customerName}</Text>
          {/* Add more customer details if available */}
        </View>
      </View>
    </View>
  );
}
