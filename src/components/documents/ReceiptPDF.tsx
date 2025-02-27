
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@/types/inventory';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12 },
  rtlPage: { padding: 20, fontSize: 12, direction: 'rtl', fontFamily: 'Helvetica' },
  header: { marginBottom: 10, alignItems: 'center' },
  title: { fontSize: 16, marginBottom: 5 },
  info: { marginBottom: 10 },
  table: { marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', padding: 3 },
  rtlTableRow: { flexDirection: 'row-reverse', borderBottomWidth: 1, borderColor: '#000', padding: 3 },
  tableCell: { flex: 1 },
  totals: { marginTop: 10, alignItems: 'flex-end' },
  rtlTotals: { marginTop: 10, alignItems: 'flex-start' },
  signature: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
  rtlSignature: { marginTop: 30, flexDirection: 'row-reverse', justifyContent: 'space-between' },
  signatureLine: { width: 150, borderTopWidth: 1, borderColor: '#000', marginTop: 20 },
  rtlText: { textAlign: 'right' },
  watermark: {
    position: 'absolute',
    top: '40%',
    left: '25%',
    fontSize: 100,
    color: 'rgba(200, 200, 200, 0.3)',
    transform: 'rotate(-45deg)',
    zIndex: -1
  }
});

interface ReceiptPDFProps {
  invoice: Invoice;
  customerName: string;
  paymentMethod?: string;
}

export const ReceiptPDF = ({ invoice, customerName, paymentMethod }: ReceiptPDFProps) => {
  // Get language settings
  const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
  const isRTL = currentLanguage === 'ar';
  const currency = localStorage.getItem('currency') || 'SAR';

  // Format currency based on language
  const formatCurrency = (amount: number) => {
    return isRTL 
      ? `${amount.toFixed(2)} ${currency}` 
      : `${currency} ${amount.toFixed(2)}`;
  };

  // Get translated labels
  const labels = isRTL ? {
    receipt: "إيصال نقدي",
    receiptNo: "رقم الإيصال",
    date: "التاريخ",
    receivedFrom: "استلمنا من",
    paymentMethod: "طريقة الدفع",
    invoiceReference: "مرجع الفاتورة",
    amountReceived: "المبلغ المستلم",
    amountInWords: "المبلغ بالكلمات",
    receivedBy: "استلم بواسطة",
    customerSignature: "توقيع العميل",
    cash: "نقدي",
    paid: "مدفوع"
  } : {
    receipt: "Cash Receipt",
    receiptNo: "Receipt No",
    date: "Date",
    receivedFrom: "Received from",
    paymentMethod: "Payment Method",
    invoiceReference: "Invoice Reference",
    amountReceived: "Amount Received",
    amountInWords: "Amount in Words",
    receivedBy: "Received By",
    customerSignature: "Customer Signature",
    cash: "Cash",
    paid: "PAID"
  };

  // Receipt number
  const receiptNo = isRTL 
    ? `إيصال-${invoice.id.slice(0, 8)}`
    : `REC-${invoice.id.slice(0, 8)}`;

  return (
    <Document>
      <Page size="A6" style={isRTL ? styles.rtlPage : styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{labels.receipt}</Text>
          <Text style={isRTL ? styles.rtlText : {}}>{labels.receiptNo}: {receiptNo}</Text>
          <Text style={isRTL ? styles.rtlText : {}}>
            {labels.date}: {new Date().toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={isRTL ? styles.rtlText : {}}>
            {labels.receivedFrom}: {customerName}
          </Text>
          <Text style={isRTL ? styles.rtlText : {}}>
            {labels.paymentMethod}: {paymentMethod || labels.cash}
          </Text>
          <Text style={isRTL ? styles.rtlText : {}}>
            {labels.invoiceReference}: {isRTL ? `فاتورة-${invoice.id.slice(0, 8)}` : `INV-${invoice.id.slice(0, 8)}`}
          </Text>
        </View>

        <View style={isRTL ? styles.rtlTotals : styles.totals}>
          <Text style={isRTL ? styles.rtlText : {}}>
            {labels.amountReceived}: {formatCurrency(invoice.total)}
          </Text>
          <Text style={isRTL ? styles.rtlText : {}}>
            {labels.amountInWords}: [Amount in words]
          </Text>
        </View>

        <View style={isRTL ? styles.rtlSignature : styles.signature}>
          <View>
            <View style={styles.signatureLine} />
            <Text style={isRTL ? styles.rtlText : {}}>{labels.receivedBy}</Text>
          </View>
          <View>
            <View style={styles.signatureLine} />
            <Text style={isRTL ? styles.rtlText : {}}>{labels.customerSignature}</Text>
          </View>
        </View>
        
        {invoice.status === 'paid' && (
          <Text style={styles.watermark}>{labels.paid}</Text>
        )}
      </Page>
    </Document>
  );
};
