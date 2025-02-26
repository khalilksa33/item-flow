
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
  const { t } = useTranslation();
  
  const totalRowStyle = [styles.totalRow];
  if (isRTL) totalRowStyle.push(styles.rtlRow);
  
  const totalLabelStyle = [styles.totalLabel];
  if (isRTL) totalLabelStyle.push(styles.rtlValue);
  
  const totalValueStyle = [styles.totalValue];
  if (isRTL) totalValueStyle.push(styles.rtlValue);
  
  return (
    <View style={styles.totals}>
      <View style={totalRowStyle}>
        <Text style={totalLabelStyle}>{t("invoices.subtotal")}:</Text>
        <Text style={totalValueStyle}>{currency} {formatNumber(subtotal)}</Text>
      </View>
      <View style={totalRowStyle}>
        <Text style={totalLabelStyle}>{t("invoices.vat")} ({(vatRate * 100).toFixed()}%):</Text>
        <Text style={totalValueStyle}>{currency} {formatNumber(vatAmount)}</Text>
      </View>
      <View style={[...totalRowStyle, styles.grandTotal]}>
        <Text style={totalLabelStyle}>{t("invoices.total")}:</Text>
        <Text style={totalValueStyle}>{currency} {formatNumber(total)}</Text>
      </View>
    </View>
  );
}
