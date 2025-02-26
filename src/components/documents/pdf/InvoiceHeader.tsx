
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
  const { t } = useTranslation();
  
  // Use the logo provided or a transparent placeholder (to maintain layout)
  const logoUrl = companyLogo || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  
  return (
    <View style={[styles.header, isRTL && styles.rtlRow]}>
      {/* Left section (or right in RTL) */}
      <View style={[
        styles.headerLeft,
        isRTL ? { alignItems: 'flex-end', textAlign: 'right' } : {}
      ]}>
        <Text style={styles.companyName}>{companyName}</Text>
        {vatNumber && <Text style={styles.companyInfo}>{t("invoices.vatNumber")}: {vatNumber}</Text>}
        {crNumber && <Text style={styles.companyInfo}>{t("invoices.crNumber")}: {crNumber}</Text>}
        {companyAddress && <Text style={styles.companyInfo}>{t("invoices.address")}: {companyAddress}</Text>}
        {companyPhone && <Text style={styles.companyInfo}>{t("invoices.phone")}: {companyPhone}</Text>}
        {companyEmail && <Text style={styles.companyInfo}>{t("invoices.email")}: {companyEmail}</Text>}
      </View>
      
      {/* Center section - Logo */}
      <View style={styles.logoContainer}>
        <Image src={logoUrl} style={styles.logo} />
      </View>
      
      {/* Right section (or left in RTL) - QR Code */}
      <View style={styles.headerRight}>
        <Image style={styles.qrCode} src={qrCodeUrl} />
      </View>
    </View>
  );
}
