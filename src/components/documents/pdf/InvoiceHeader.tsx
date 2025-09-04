
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
        {companyName && (
          <Text style={styles.companyName}>{companyName}</Text>
        )}
        <Text style={styles.companyInfo}>{labels.vatNumber}: {vatNumber}</Text>
        <Text style={styles.companyInfo}>{labels.crNumber}: {crNumber}</Text>
        <Text style={styles.companyInfo}>{labels.phone}: {companyPhone}</Text>
        <Text style={styles.companyInfo}>{labels.email}: {companyEmail}</Text>
      </View>

      {/* Logo and Address */}
      <View style={styles.headerCenter}>
        {companyLogo && (
          <Image 
            src={companyLogo} 
            style={styles.logo}
            cache={false}
          />
        )}
        {companyAddress && (
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{companyAddress}</Text>
          </View>
        )}
      </View>

      {/* QR Code */}
      <View style={styles.headerQR}>
        <Image src={qrCodeUrl} style={styles.qrCode} />
        <Text style={styles.qrLabel}>
          {isRTL ? 'رمز الاستجابة السريعة' : 'QR Code'}
        </Text>
      </View>
    </View>
  );
}
