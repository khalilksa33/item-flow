
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
  },
  
  // Header styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
    gap: 20,
  },
  headerInfo: {
    flex: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerQR: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 120,
    height: 80,
    objectFit: 'contain',
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  companyInfo: {
    fontSize: 10,
    marginBottom: 4,
  },
  
  // Invoice info styles
  invoiceInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 10,
  },
  
  // Table styles
  table: {
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeaderRTL: {
    flexDirection: 'row-reverse',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableRowRTL: {
    flexDirection: 'row-reverse',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  tableCellRTL: {
    flex: 1,
    fontSize: 10,
    textAlign: 'right',
  },
  
  // Totals styles
  totals: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  totalRowRTL: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalLabelRTL: {
    width: 100,
    textAlign: 'left',
    paddingLeft: 10,
  },
  totalValue: {
    width: 100,
    textAlign: 'right',
  },
  totalValueRTL: {
    width: 100,
    textAlign: 'left',
  },
  
  // Footer styles
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
  },
  
  // RTL styles
  rtl: {
    direction: 'rtl',
  },
  rtlRow: {
    flexDirection: 'row-reverse',
  },
  rtlSection: {
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  rtlText: {
    textAlign: 'right',
  }
});
