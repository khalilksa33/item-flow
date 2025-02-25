
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

interface InvoiceTotalsProps {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  formatNumber: (value: number | undefined) => string;
}

export function InvoiceTotals({ 
  subtotal, 
  vatRate, 
  vatAmount, 
  total, 
  currency,
  formatNumber 
}: InvoiceTotalsProps) {
  return (
    <View style={styles.totals}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Subtotal:</Text>
        <Text style={styles.totalValue}>{currency} {formatNumber(subtotal)}</Text>
      </View>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>VAT ({(vatRate * 100).toFixed()}%):</Text>
        <Text style={styles.totalValue}>{currency} {formatNumber(vatAmount)}</Text>
      </View>
      <View style={[styles.totalRow, styles.grandTotal]}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalValue}>{currency} {formatNumber(total)}</Text>
      </View>
    </View>
  );
}
