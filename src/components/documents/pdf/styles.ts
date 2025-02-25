
import { StyleSheet } from '@react-pdf/renderer';

// Define styles with appropriate font sizes
export const styles = StyleSheet.create({
  page: { 
    padding: 30,
    fontSize: 10, // Default smaller font size
    fontFamily: 'Helvetica',
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottom: '1px solid #cccccc',
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  qrCode: {
    width: 80,
    height: 80,
  },
  companyName: { 
    fontSize: 16, // Smaller company name size
    fontWeight: 'bold',
    marginBottom: 5,
  },
  companyInfo: { 
    fontSize: 8, // Smaller company info
    color: '#666',
    marginBottom: 2,
  },
  title: { 
    fontSize: 18, // Smaller title
    marginBottom: 10,
    color: '#333',
    textTransform: 'uppercase',
  },
  invoiceInfo: {
    marginBottom: 15,
  },
  invoiceDetail: {
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: { 
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: { 
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    minHeight: 25,
    alignItems: 'center',
  },
  tableHeader: { 
    backgroundColor: '#f8f9fa',
    fontWeight: 'bold',
  },
  tableCell: { 
    flex: 1,
    padding: 5,
    fontSize: 9,
  },
  tableCellNarrow: {
    flex: 0.5,
    padding: 5,
    fontSize: 9,
  },
  tableCellWide: {
    flex: 2,
    padding: 5,
    fontSize: 9,
  },
  totals: { 
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 3,
  },
  totalLabel: {
    width: 100,
    textAlign: 'right',
    paddingRight: 10,
  },
  totalValue: {
    width: 80,
    textAlign: 'right',
  },
  grandTotal: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  notes: {
    marginTop: 20,
    fontSize: 9,
    fontStyle: 'italic',
    color: '#666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    borderTopWidth: 1,
    borderColor: '#cccccc',
    paddingTop: 10,
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  thankYou: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 11,
    color: '#333',
  },
  watermark: {
    position: 'absolute',
    bottom: 200,
    right: 60,
    fontSize: 60,
    color: 'rgba(200, 200, 200, 0.3)',
    transform: 'rotate(-45deg)',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
