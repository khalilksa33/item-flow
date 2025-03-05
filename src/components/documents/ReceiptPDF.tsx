
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Invoice } from '@/types/inventory';

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 12, fontFamily: 'Helvetica' },
  rtlPage: { 
    padding: 20, 
    fontSize: 12, 
    direction: 'rtl', 
    fontFamily: 'Helvetica', 
    textAlign: 'right' 
  },
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
  // Get language settings directly from localStorage (not relying on React context)
  const currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
  const isRTL = currentLanguage === 'ar';
  
  console.log(`ReceiptPDF rendering with language: ${currentLanguage}, isRTL: ${isRTL}`);
  
  const currency = localStorage.getItem('currency') || 'SAR';

  // Format currency based on language
  const formatCurrency = (amount: number) => {
    return isRTL 
      ? `${amount.toFixed(2)} ${currency}` 
      : `${currency} ${amount.toFixed(2)}`;
  };

  // Hardcoded labels to avoid i18n issues in PDF
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

  // Convert number to words function for Arabic and English
  const convertToWords = (amount: number): string => {
    if (isRTL) {
      // Simple Arabic implementation (can be enhanced)
      if (amount === 0) return "صفر";
      // This is a placeholder - for a production app you'd want a proper Arabic number-to-words converter
      return `${amount.toFixed(2)} (بالأرقام فقط)`;
    } else {
      // Simple English implementation
      const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      
      // Basic implementation - for a production app you'd want a more comprehensive solution
      if (amount < 10) return units[Math.floor(amount)] + " only";
      if (amount < 20) return teens[Math.floor(amount) - 10] + " only";
      if (amount < 100) return tens[Math.floor(amount / 10)] + (amount % 10 ? ' ' + units[Math.floor(amount % 10)] : '') + " only";
      
      return amount.toFixed(2) + " (in figures only)";
    }
  };

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
            {labels.amountInWords}: {convertToWords(invoice.total)}
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
