
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
      {/* Left section (or right in RTL) with company info */}
      <View style={[
        styles.headerLeft,
        isRTL ? { alignItems: 'flex-end', textAlign: 'right' } : {}
      ]}>
        <Text style={styles.companyName}>{companyName}</Text>
        {vatNumber && <Text style={styles.companyInfo}>{t("vatNumber")}: {vatNumber}</Text>}
        {crNumber && <Text style={styles.companyInfo}>{t("crNumber")}: {crNumber}</Text>}
        {companyAddress && <Text style={styles.companyInfo}>{t("address")}: {companyAddress}</Text>}
        {companyPhone && <Text style={styles.companyInfo}>{t("phone")}: {companyPhone}</Text>}
        {companyEmail && <Text style={styles.companyInfo}>{t("email")}: {companyEmail}</Text>}
      </View>
      
      {/* Center section with logo */}
      {companyLogo && (
        <View style={styles.logoContainer}>
          <Image src={companyLogo} style={styles.logo} />
        </View>
      )}
      
      {/* Right section (or left in RTL) with QR code */}
      <View style={styles.headerRight}>
        <Image style={styles.qrCode} src={qrCodeUrl} />
      </View>
    </View>
  );
}
