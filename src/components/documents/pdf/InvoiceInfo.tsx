
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
}

export function InvoiceInfo({
  invoiceRef,
  createdAt,
  paymentDue,
  paymentTerms,
  customerName,
  formatDate
}: InvoiceInfoProps) {
  const { t } = useTranslation();
  
  return (
    <View style={styles.invoiceInfo}>
      <Text style={styles.title}>{t("invoices.invoice")}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.invoiceDetail}>{t("invoices.reference")}: {invoiceRef}</Text>
          <Text style={styles.invoiceDetail}>{t("invoices.date")}: {formatDate(createdAt)}</Text>
          <Text style={styles.invoiceDetail}>{t("invoices.dueDate")}: {formatDate(paymentDue)}</Text>
          {paymentTerms && <Text style={styles.invoiceDetail}>{t("invoices.paymentTerms")}: {paymentTerms}</Text>}
        </View>
        <View>
          <Text style={styles.sectionTitle}>{t("invoices.billTo")}:</Text>
          <Text style={styles.invoiceDetail}>{customerName}</Text>
          {/* Add more customer details if available */}
        </View>
      </View>
    </View>
  );
}
