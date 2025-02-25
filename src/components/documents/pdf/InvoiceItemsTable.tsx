
import { Text, View } from '@react-pdf/renderer';
import { InvoiceItem } from '@/types/inventory';
import { styles } from './styles';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currency: string;
  formatNumber: (value: number | undefined) => string;
}

export function InvoiceItemsTable({ items, currency, formatNumber }: InvoiceItemsTableProps) {
  return (
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
  );
}
