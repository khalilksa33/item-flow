
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

interface InvoiceInfoProps {
  invoiceRef: string;
  createdAt: string;
  paymentDue: string;
  paymentTerms?: string;
  customerName: string;
  formatDate: (dateString: string) => string;
  isRTL?: boolean;
  labels: Record<string, string>;
}

export function InvoiceInfo({
  invoiceRef,
  createdAt,
  paymentDue,
  paymentTerms,
  customerName,
  formatDate,
  isRTL = false,
  labels
}: InvoiceInfoProps) {
  return (
    <View style={styles.invoiceInfo}>
      <Text style={[styles.title, isRTL && styles.rtlText]}>{labels.invoice}</Text>
      <View style={[styles.infoRow, isRTL && styles.rtlRow]}>
        <View>
          <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
            {labels.reference}: {invoiceRef}
          </Text>
          <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
            {labels.date}: {formatDate(createdAt)}
          </Text>
          <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
            {labels.dueDate}: {formatDate(paymentDue)}
          </Text>
          {paymentTerms && (
            <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
              {labels.paymentTerms}: {paymentTerms}
            </Text>
          )}
        </View>
        <View>
          <Text style={[styles.infoLabel, isRTL && styles.rtlText]}>
            {labels.billTo}:
          </Text>
          <Text style={[styles.infoValue, isRTL && styles.rtlText]}>
            {customerName}
          </Text>
        </View>
      </View>
    </View>
  );
}
