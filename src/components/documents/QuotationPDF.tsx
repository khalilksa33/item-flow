
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
  const { t } = useTranslation();
  
  const companyName = localStorage.getItem('companyName') || 'Company Name';
  const vatNumber = localStorage.getItem('vatNumber') || '';
  const crNumber = localStorage.getItem('crNumber') || '';
  const companyAddress = localStorage.getItem('companyAddress') || '';
  const companyPhone = localStorage.getItem('companyPhone') || '';
  const companyEmail = localStorage.getItem('companyEmail') || '';
  const currency = localStorage.getItem('currency') || 'USD';
  const companyLogo = localStorage.getItem('companyLogo') || '';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.companyHeader}>
            <Text style={styles.companyName}>{companyName}</Text>
            {vatNumber && <Text style={styles.companyInfo}>{t("invoices.vatNumber")}: {vatNumber}</Text>}
            {crNumber && <Text style={styles.companyInfo}>{t("invoices.crNumber")}: {crNumber}</Text>}
            {companyAddress && <Text style={styles.companyInfo}>{t("invoices.address")}: {companyAddress}</Text>}
            {companyPhone && <Text style={styles.companyInfo}>{t("invoices.phone")}: {companyPhone}</Text>}
            {companyEmail && <Text style={styles.companyInfo}>{t("invoices.email")}: {companyEmail}</Text>}
          </View>
          {companyLogo && (
            <View style={styles.logoContainer}>
              <Image src={companyLogo} style={styles.logo} />
            </View>
          )}
        </View>

        <View>
          <Text style={styles.title}>{t("quotations.title")}</Text>
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.infoItem}>{t("invoices.date")}: {formatDate(quotation.createdAt)}</Text>
              <Text style={styles.infoItem}>{t("quotations.validUntil")}: {formatDate(quotation.validUntil)}</Text>
              {quotation.terms && <Text style={styles.infoItem}>{t("invoices.paymentTerms")}: {quotation.terms}</Text>}
            </View>
            <View>
              <Text style={styles.infoItem}>{t("invoices.billTo")}: {customerName}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>{t("invoices.item")}</Text>
            <Text style={styles.tableCell}>{t("invoices.quantity")}</Text>
            <Text style={styles.tableCell}>{t("invoices.unitPrice")}</Text>
            <Text style={styles.tableCell}>{t("invoices.subtotal")}</Text>
          </View>
          {quotation.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.productId}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>{currency} {item.unitPrice.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{currency} {item.subtotal.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t("invoices.subtotal")}:</Text>
            <Text style={styles.totalValue}>{currency} {quotation.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t("invoices.vat")} ({(quotation.vatRate * 100).toFixed()}%):</Text>
            <Text style={styles.totalValue}>{currency} {quotation.vatAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.totalLabel}>{t("invoices.total")}:</Text>
            <Text style={styles.totalValue}>{currency} {quotation.total.toFixed(2)}</Text>
          </View>
        </View>

        {quotation.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>{t("invoices.notes")}:</Text>
            <Text>{quotation.notes}</Text>
          </View>
        )}

        <View style={styles.footer}>
          <Text>{companyName} • {companyAddress} • {companyPhone}</Text>
          <Text>{t("invoices.generatedOn")} {new Date().toLocaleDateString()}</Text>
        </View>
      </Page>
    </Document>
  );
};
