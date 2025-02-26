
import { Text, View, Image } from '@react-pdf/renderer';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';

interface InvoiceHeaderProps {
  companyName: string;
  vatNumber: string;
  crNumber: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyLogo: string;
  qrCodeUrl: string;
  isRTL?: boolean;
}

export function InvoiceHeader({
  companyName,
  vatNumber,
  crNumber,
  companyAddress,
  companyPhone,
  companyEmail,
  companyLogo,
  qrCodeUrl,
  isRTL = false
}: InvoiceHeaderProps) {
  const { t } = useTranslation("invoices");
  
  return (
    <View style={[styles.header, isRTL && styles.rtlRow]}>
      {/* Company Info */}
      <View style={[styles.headerInfo, isRTL && styles.rtlSection]}>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.companyInfo}>{t("vatNumber")}: {vatNumber}</Text>
        <Text style={styles.companyInfo}>{t("crNumber")}: {crNumber}</Text>
        <Text style={styles.companyInfo}>{t("address")}: {companyAddress}</Text>
        <Text style={styles.companyInfo}>{t("phone")}: {companyPhone}</Text>
        <Text style={styles.companyInfo}>{t("email")}: {companyEmail}</Text>
      </View>

      {/* Logo */}
      {companyLogo && (
        <View style={styles.headerCenter}>
          <Image 
            src={companyLogo} 
            style={styles.logo}
          />
        </View>
      )}

      {/* QR Code */}
      <View style={styles.headerQR}>
        <Image src={qrCodeUrl} style={styles.qrCode} />
      </View>
    </View>
  );
}
