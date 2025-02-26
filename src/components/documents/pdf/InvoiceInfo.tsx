
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

interface InvoiceInfoProps {
  invoiceRef: string;
  createdAt: string;
  paymentDue: string;
  paymentTerms?: string;
  customerName: string;
  formatDate: (dateString: string) => string;
  isRTL?: boolean;
}

export function InvoiceInfo({
  invoiceRef,
  createdAt,
  paymentDue,
  paymentTerms,
  customerName,
  formatDate,
  isRTL = false
}: InvoiceInfoProps) {
  const { t } = useTranslation("invoices");
  
  return (
    <View style={styles.invoiceInfo}>
      <Text style={styles.title}>{t("invoice")}</Text>
      <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }, isRTL && styles.rtlRow]}>
        <View style={isRTL ? { alignItems: 'flex-end' } : {}}>
          <Text style={styles.invoiceDetail}>{t("reference")}: {invoiceRef}</Text>
          <Text style={styles.invoiceDetail}>{t("date")}: {formatDate(createdAt)}</Text>
          <Text style={styles.invoiceDetail}>{t("dueDate")}: {formatDate(paymentDue)}</Text>
          {paymentTerms && <Text style={styles.invoiceDetail}>{t("paymentTerms")}: {paymentTerms}</Text>}
        </View>
        <View style={isRTL ? { alignItems: 'flex-start' } : {}}>
          <Text style={styles.sectionTitle}>{t("billTo")}:</Text>
          <Text style={styles.invoiceDetail}>{customerName}</Text>
        </View>
      </View>
    </View>
  );
}
