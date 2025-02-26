
import { Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

interface InvoiceFooterProps {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  notes?: string;
  status?: string;
  isRTL?: boolean;
}

export function InvoiceFooter({ 
  companyName, 
  companyAddress, 
  companyPhone, 
  notes,
  status,
  isRTL = false
}: InvoiceFooterProps) {
  const { t } = useTranslation();
  
  return (
    <>
      {notes && (
        <View style={[styles.notes, isRTL && styles.rtlSection]}>
          <Text style={styles.sectionTitle}>{t("invoices.notes")}</Text>
          <Text>{notes}</Text>
        </View>
      )}

      <View style={styles.thankYou}>
        <Text>{t("invoices.thankYou")}</Text>
      </View>

      {status === 'paid' && (
        <Text style={styles.watermark}>{t("invoices.paid")}</Text>
      )}

      <View style={[styles.footer, isRTL && styles.rtlSection]}>
        <Text>{companyName} • {companyAddress} • {companyPhone}</Text>
      </View>
    </>
  );
}
