
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
      <Text style={[styles.title, isRTL && styles.rtlText]}>{t("invoice")}</Text>
      <View style={[styles.infoRow, isRTL && styles.rtlRow]}>
        <View>
          <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{t("reference")}: {invoiceRef}</Text>
          <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{t("date")}: {formatDate(createdAt)}</Text>
          <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{t("dueDate")}: {formatDate(paymentDue)}</Text>
          {paymentTerms && (
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
              {t("paymentTerms")}: {paymentTerms}
            </Text>
          )}
        </View>
        <View>
          <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>{t("billTo")}:</Text>
          <Text style={[styles.infoValue, isRTL && styles.rtlText]}>{customerName}</Text>
        </View>
      </View>
    </View>
  );
}
