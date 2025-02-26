
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

interface InvoiceTotalsProps {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  formatNumber: (value: number | undefined) => string;
  isRTL?: boolean;
}

export function InvoiceTotals({ 
  subtotal, 
  vatRate, 
  vatAmount, 
  total, 
  currency,
  formatNumber,
  isRTL = false
}: InvoiceTotalsProps) {
  const { t } = useTranslation("invoices");
  
  return (
    <View style={styles.totals}>
      <View style={isRTL ? styles.totalRowRTL : styles.totalRow}>
        <Text style={isRTL ? styles.totalLabelRTL : styles.totalLabel}>{t("subtotal")}:</Text>
        <Text style={isRTL ? styles.totalValueRTL : styles.totalValue}>{currency} {formatNumber(subtotal)}</Text>
      </View>
      <View style={isRTL ? styles.totalRowRTL : styles.totalRow}>
        <Text style={isRTL ? styles.totalLabelRTL : styles.totalLabel}>{t("vat")} ({(vatRate * 100).toFixed()}%):</Text>
        <Text style={isRTL ? styles.totalValueRTL : styles.totalValue}>{currency} {formatNumber(vatAmount)}</Text>
      </View>
      <View style={[isRTL ? styles.totalRowRTL : styles.totalRow, styles.grandTotal]}>
        <Text style={isRTL ? styles.totalLabelRTL : styles.totalLabel}>{t("total")}:</Text>
        <Text style={isRTL ? styles.totalValueRTL : styles.totalValue}>{currency} {formatNumber(total)}</Text>
      </View>
    </View>
  );
}
