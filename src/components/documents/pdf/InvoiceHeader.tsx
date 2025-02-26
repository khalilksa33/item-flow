
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
  
  // Create a placeholder logo URL if none is provided
  const logoUrl = companyLogo || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80';
  
  return (
    <View style={[styles.header, isRTL && styles.rtlRow]}>
      <View style={styles.headerLeft}>
        <Text style={styles.companyName}>{companyName}</Text>
        {vatNumber && <Text style={styles.companyInfo}>{t("invoices.vatNumber")}: {vatNumber}</Text>}
        {crNumber && <Text style={styles.companyInfo}>{t("invoices.crNumber")}: {crNumber}</Text>}
        {companyAddress && <Text style={styles.companyInfo}>{t("invoices.address")}: {companyAddress}</Text>}
        {companyPhone && <Text style={styles.companyInfo}>{t("invoices.phone")}: {companyPhone}</Text>}
        {companyEmail && <Text style={styles.companyInfo}>{t("invoices.email")}: {companyEmail}</Text>}
      </View>
      
      <View style={styles.logoContainer}>
        <Image src={logoUrl} style={styles.logo} />
      </View>
      
      <View style={styles.headerRight}>
        <Image style={styles.qrCode} src={qrCodeUrl} />
      </View>
    </View>
  );
}
