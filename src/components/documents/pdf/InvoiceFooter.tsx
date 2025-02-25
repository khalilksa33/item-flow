
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

interface InvoiceFooterProps {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  notes?: string;
  status?: string;
}

export function InvoiceFooter({ 
  companyName, 
  companyAddress, 
  companyPhone, 
  notes,
  status
}: InvoiceFooterProps) {
  return (
    <>
      {notes && (
        <View style={styles.notes}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <Text>{notes}</Text>
        </View>
      )}

      <View style={styles.thankYou}>
        <Text>Thank you for your business!</Text>
      </View>

      {status === 'paid' && (
        <Text style={styles.watermark}>PAID</Text>
      )}

      <View style={styles.footer}>
        <Text>{companyName} • {companyAddress} • {companyPhone}</Text>
        <Text>Generated on {new Date().toLocaleDateString()}</Text>
      </View>
    </>
  );
}
