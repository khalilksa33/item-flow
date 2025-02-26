
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Quotation } from '@/types/inventory';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  page: { padding: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  logoContainer: { maxWidth: 150, maxHeight: 80 },
  logo: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' },
  companyHeader: { flex: 1, marginBottom: 15 },
  companyName: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  companyInfo: { fontSize: 10, color: '#666', marginBottom: 2 },
  title: { fontSize: 24, marginBottom: 10 },
  info: { marginBottom: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  infoItem: { fontSize: 12 },
  table: { marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', padding: 5 },
  tableHeader: { fontWeight: 'bold', backgroundColor: '#f0f0f0' },
  tableCell: { flex: 1, fontSize: 10, padding: 3 },
  totals: { marginTop: 20, alignItems: 'flex-end' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 5 },
  totalLabel: { marginRight: 20, fontSize: 12 },
  totalValue: { fontSize: 12, minWidth: 80, textAlign: 'right' },
  grandTotal: { fontWeight: 'bold', marginTop: 5, paddingTop: 5, borderTopWidth: 1, borderColor: '#000' },
  notes: { marginTop: 30, fontSize: 10 },
  notesTitle: { fontWeight: 'bold', marginBottom: 5 },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', fontSize: 9, color: '#666' }
});

interface QuotationPDFProps {
  quotation: Quotation;
  customerName: string;
}

export const QuotationPDF = ({ quotation, customerName }: QuotationPDFProps) => {
  // Use a direct import since useTranslation doesn't work well in PDF context
  const isRTL = localStorage.getItem('preferredLanguage') === 'ar';
  
  const companyName = localStorage.getItem('companyName') || 'Company Name';
  const vatNumber = localStorage.getItem('vatNumber') || '';
  const crNumber = localStorage.getItem('crNumber') || '';
  const companyAddress = localStorage.getItem('companyAddress') || '';
  const companyPhone = localStorage.getItem('companyPhone') || '';
  const companyEmail = localStorage.getItem('companyEmail') || '';
  const currency = localStorage.getItem('currency') || 'SAR';
  const companyLogo = localStorage.getItem('companyLogo') || '';

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Safe formatting function to handle undefined values
  const safeFormatNumber = (value: number | undefined) => {
    return typeof value === 'number' ? value.toFixed(2) : '0.00';
  };

  // Ensure quotation items array exists
  const items = quotation.items || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyHeader}>
            <Text style={styles.companyName}>{companyName}</Text>
            {vatNumber && <Text style={styles.companyInfo}>VAT Number: {vatNumber}</Text>}
            {crNumber && <Text style={styles.companyInfo}>CR Number: {crNumber}</Text>}
            {companyAddress && <Text style={styles.companyInfo}>Address: {companyAddress}</Text>}
            {companyPhone && <Text style={styles.companyInfo}>Phone: {companyPhone}</Text>}
            {companyEmail && <Text style={styles.companyInfo}>Email: {companyEmail}</Text>}
          </View>
          {companyLogo && (
            <View style={styles.logoContainer}>
              <Image src={companyLogo} style={styles.logo} />
            </View>
          )}
        </View>

        <View>
          <Text style={styles.title}>{isRTL ? 'عرض أسعار' : 'Quotation'}</Text>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoItem}>{isRTL ? 'التاريخ:' : 'Date:'} {formatDate(quotation.createdAt || new Date().toISOString())}</Text>
              <Text style={styles.infoItem}>{isRTL ? 'صالح حتى:' : 'Valid Until:'} {formatDate(quotation.validUntil || '')}</Text>
              {quotation.terms && <Text style={styles.infoItem}>{isRTL ? 'الشروط:' : 'Terms:'} {quotation.terms}</Text>}
            </View>
            <View>
              <Text style={styles.infoItem}>{isRTL ? 'العميل:' : 'Customer:'} {customerName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>{isRTL ? 'المنتج' : 'Item'}</Text>
            <Text style={styles.tableCell}>{isRTL ? 'الكمية' : 'Quantity'}</Text>
            <Text style={styles.tableCell}>{isRTL ? 'سعر الوحدة' : 'Unit Price'}</Text>
            <Text style={styles.tableCell}>{isRTL ? 'المجموع الفرعي' : 'Subtotal'}</Text>
          </View>
          {items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.productId}</Text>
              <Text style={styles.tableCell}>{item.quantity || 0}</Text>
              <Text style={styles.tableCell}>{currency} {safeFormatNumber(item.unitPrice)}</Text>
              <Text style={styles.tableCell}>{currency} {safeFormatNumber(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</Text>
            <Text style={styles.totalValue}>{currency} {safeFormatNumber(quotation.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {isRTL ? `ضريبة القيمة المضافة (${((quotation.vatRate || 0) * 100).toFixed()}%):` : 
                `VAT (${((quotation.vatRate || 0) * 100).toFixed()}%):`}
            </Text>
            <Text style={styles.totalValue}>{currency} {safeFormatNumber(quotation.vatAmount)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.totalLabel}>{isRTL ? 'المجموع:' : 'Total:'}</Text>
            <Text style={styles.totalValue}>{currency} {safeFormatNumber(quotation.total)}</Text>
          </View>
        </View>

        {quotation.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>{isRTL ? 'ملاحظات:' : 'Notes:'}</Text>
            <Text>{quotation.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>{companyName} • {companyAddress} • {companyPhone}</Text>
          <Text>{isRTL ? 'تم إنشاؤه في ' : 'Generated on '} {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};
