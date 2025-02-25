
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
}

export function InvoiceHeader({
  companyName,
  vatNumber,
  crNumber,
  companyAddress,
  companyPhone,
  companyEmail,
  companyLogo,
  qrCodeUrl
}: InvoiceHeaderProps) {
  const { t } = useTranslation();
  
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.companyName}>{companyName}</Text>
        {vatNumber && <Text style={styles.companyInfo}>{t("invoices.vatNumber")}: {vatNumber}</Text>}
        {crNumber && <Text style={styles.companyInfo}>{t("invoices.crNumber")}: {crNumber}</Text>}
        {companyAddress && <Text style={styles.companyInfo}>{t("invoices.address")}: {companyAddress}</Text>}
        {companyPhone && <Text style={styles.companyInfo}>{t("invoices.phone")}: {companyPhone}</Text>}
        {companyEmail && <Text style={styles.companyInfo}>{t("invoices.email")}: {companyEmail}</Text>}
      </View>
      <View style={styles.logoContainer}>
        {companyLogo && (
          <Image
            src={companyLogo}
            style={styles.logo}
          />
        )}
      </View>
      <View style={styles.headerRight}>
        <Image style={styles.qrCode} src={qrCodeUrl} />
      </View>
    </View>
  );
}
