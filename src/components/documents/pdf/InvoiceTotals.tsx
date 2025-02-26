
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

interface InvoiceTotalsProps {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  formatNumber: (value: number | undefined) => string;
  isRTL?: boolean;
  labels: Record<string, string>;
}

export function InvoiceTotals({ 
  subtotal, 
  vatRate, 
  vatAmount, 
  total, 
  currency,
  formatNumber,
  isRTL = false,
  labels
}: InvoiceTotalsProps) {
  return (
    <View style={styles.totals}>
      <View style={isRTL ? styles.totalRowRTL : styles.totalRow}>
        <Text style={isRTL ? styles.totalLabelRTL : styles.totalLabel}>
          {labels.subtotal}:
        </Text>
        <Text style={isRTL ? styles.totalValueRTL : styles.totalValue}>
          {isRTL ? `${formatNumber(subtotal)} ${currency}` : `${currency} ${formatNumber(subtotal)}`}
        </Text>
      </View>
      
      <View style={isRTL ? styles.totalRowRTL : styles.totalRow}>
        <Text style={isRTL ? styles.totalLabelRTL : styles.totalLabel}>
          {labels.vat} ({(vatRate * 100).toFixed()}%):
        </Text>
        <Text style={isRTL ? styles.totalValueRTL : styles.totalValue}>
          {isRTL ? `${formatNumber(vatAmount)} ${currency}` : `${currency} ${formatNumber(vatAmount)}`}
        </Text>
      </View>
      
      <View style={[isRTL ? styles.totalRowRTL : styles.totalRow, styles.grandTotal]}>
        <Text style={isRTL ? styles.totalLabelRTL : styles.totalLabel}>
          {labels.total}:
        </Text>
        <Text style={isRTL ? styles.totalValueRTL : styles.totalValue}>
          {isRTL ? `${formatNumber(total)} ${currency}` : `${currency} ${formatNumber(total)}`}
        </Text>
      </View>
    </View>
  );
}
