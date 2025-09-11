
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
      {/* QR Code - moved to left corner */}
      <View style={styles.headerQR}>
        <Image src={qrCodeUrl} style={styles.qrCode} />
        <Text style={styles.qrLabel}>
          {isRTL ? 'رمز الاستجابة السريعة' : 'QR Code'}
        </Text>
      </View>

      {/* Company Info */}
      <View style={[styles.headerInfo, isRTL && styles.rtlSection]}>
        {/* Show Arabic company name first if exists */}
        {localStorage.getItem("companyNameAr") && (
          <Text style={[styles.companyName, { fontFamily: 'Helvetica' }]}>
            {localStorage.getItem("companyNameAr")}
          </Text>
        )}
        {companyName && (
          <Text style={styles.companyName}>{companyName}</Text>
        )}
        <Text style={styles.companyInfo}>{labels.vatNumber}: {vatNumber}</Text>
        <Text style={styles.companyInfo}>{labels.crNumber}: {crNumber}</Text>
        <Text style={styles.companyInfo}>{labels.phone}: {companyPhone}</Text>
        <Text style={styles.companyInfo}>{labels.email}: {companyEmail}</Text>
      </View>

      {/* Logo - moved to right corner */}
      <View style={styles.headerLogo}>
        {companyLogo && (
          <Image 
            src={companyLogo} 
            style={styles.logo}
            cache={false}
          />
        )}
      </View>
    </View>
  );
}
