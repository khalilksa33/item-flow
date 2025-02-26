
import { Text, View, Image } from '@react-pdf/renderer';
import { styles } from './styles';

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
  labels: Record<string, string>;
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
  isRTL = false,
  labels
}: InvoiceHeaderProps) {
  return (
    <View style={[styles.header, isRTL && styles.rtlRow]}>
      {/* Company Info */}
      <View style={[styles.headerInfo, isRTL && styles.rtlSection]}>
        <Text style={styles.companyName}>{companyName}</Text>
        <Text style={styles.companyInfo}>{labels.vatNumber}: {vatNumber}</Text>
        <Text style={styles.companyInfo}>{labels.crNumber}: {crNumber}</Text>
        <Text style={styles.companyInfo}>{labels.phone}: {companyPhone}</Text>
        <Text style={styles.companyInfo}>{labels.email}: {companyEmail}</Text>
      </View>

      {/* Logo */}
      {companyLogo && (
        <View style={styles.headerCenter}>
          <Image 
            src={companyLogo} 
            style={styles.logo}
            cache={false}
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
