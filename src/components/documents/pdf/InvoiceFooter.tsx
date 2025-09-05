
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

interface InvoiceFooterProps {
  companyAddress?: string;
  notes?: string;
  status?: string;
  isRTL?: boolean;
  labels: Record<string, string>;
}

export function InvoiceFooter({ 
  companyAddress,
  notes,
  status,
  isRTL = false,
  labels
}: InvoiceFooterProps) {
  return (
    <>
      {notes && (
        <View style={[styles.notes, isRTL && styles.rtlSection]}>
          <Text style={styles.sectionTitle}>{labels.notes}</Text>
          <Text>{notes}</Text>
        </View>
      )}

      <View style={styles.thankYou}>
        <Text>{labels.thankYou}</Text>
      </View>

      {status === 'paid' && (
        <Text style={styles.watermark}>{labels.paid}</Text>
      )}

      {/* Company address fixed at bottom of page */}
      <View style={[styles.footer, isRTL && styles.rtlSection]} fixed>
        {companyAddress && (
          <>
            <Text style={[styles.footerText, { fontWeight: 'bold', fontSize: 9 }]}>
              {companyAddress}
            </Text>
          </>
        )}
      </View>
    </>
  );
}
