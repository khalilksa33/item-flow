
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 30,
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  rtl: {
    fontFamily: 'Helvetica',
    direction: 'rtl',
    textAlign: 'right'
  },
  rtlText: {
    textAlign: 'right'
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20
  },
  rtlRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  headerInfo: {
    flex: 1
  },
  rtlSection: {
    textAlign: 'right',
    alignItems: 'flex-end'
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center'
  },
  headerQR: {
    flex: 1,
    alignItems: 'flex-end'
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5
  },
  companyInfo: {
    fontSize: 8,
    marginBottom: 2,
    color: '#555'
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
    objectPosition: 'center'
  },
  qrCode: {
    width: 50,
    height: 50
  },
  invoiceInfo: {
    marginBottom: 20
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5
  },
  infoValue: {
    fontSize: 9,
    marginBottom: 3
  },
  section: {
    marginBottom: 10
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold'
  },
  tableHeaderRTL: {
    flexDirection: 'row-reverse',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  tableRowRTL: {
    flexDirection: 'row-reverse',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  tableCell: {
    padding: 5,
    flex: 1,
    textAlign: 'center',
    fontSize: 9
  },
  tableCellNarrow: {
    padding: 5,
    width: '5%',
    textAlign: 'center',
    fontSize: 9
  },
  tableCellWide: {
    padding: 5,
    flex: 2,
    textAlign: 'left',
    fontSize: 9
  },
  tableCellWideRTL: {
    padding: 5,
    flex: 2,
    textAlign: 'right',
    fontSize: 9
  },
  totals: {
    marginTop: 10,
    marginBottom: 20,
    paddingRight: 5
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3
  },
  totalRowRTL: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 3
  },
  totalLabel: {
    textAlign: 'right',
    flex: 1,
    fontWeight: 'bold'
  },
  totalLabelRTL: {
    textAlign: 'left',
    flex: 1,
    fontWeight: 'bold'
  },
  totalValue: {
    textAlign: 'right',
    width: 100
  },
  totalValueRTL: {
    textAlign: 'left',
    width: 100
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 3,
    fontWeight: 'bold'
  },
  notes: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10
  },
  thankYou: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 10,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    color: '#666',
    textAlign: 'center'
  },
  footerCompanyName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3
  },
  footerText: {
    fontSize: 8,
    marginBottom: 2
  },
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
