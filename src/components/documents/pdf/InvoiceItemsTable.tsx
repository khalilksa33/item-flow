
import { Text, View } from '@react-pdf/renderer';
import { InvoiceItem } from '@/types/inventory';
import { styles } from './styles';
import { storage } from '@/lib/storage';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currency: string;
  formatNumber: (value: number | undefined) => string;
  isRTL?: boolean;
  labels: Record<string, string>;
}

export function InvoiceItemsTable({ 
  items, 
  currency, 
  formatNumber, 
  isRTL = false,
  labels
}: InvoiceItemsTableProps) {
  // Get all inventory items to map product IDs to names
  const inventoryItems = storage.getItems();
  
  // Function to get product name from ID
  const getProductName = (productId: string): string => {
    const product = inventoryItems.find(item => item.id === productId);
    return product ? product.name : productId; // Fallback to ID if product not found
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{labels.items}</Text>
      <View style={styles.table}>
        <View style={isRTL ? styles.tableHeaderRTL : styles.tableHeader}>
          <Text style={styles.tableCellNarrow}>#</Text>
          <Text style={styles.tableCell}>{isRTL ? 'كود الصنف' : 'Item Code'}</Text>
          <Text style={styles.tableCellWide}>{labels.item}</Text>
          <Text style={styles.tableCell}>{labels.quantity}</Text>
          <Text style={styles.tableCell}>{labels.unitPrice}</Text>
          <Text style={styles.tableCell}>{isRTL ? 'قيمة ضريبة القيمة المضافة للوحدة (15%)' : '15% VAT per Unit'}</Text>
          <Text style={styles.tableCell}>{isRTL ? 'إجمالي قيمة الضريبة' : 'Total VAT Value'}</Text>
          <Text style={styles.tableCell}>{labels.subtotal}</Text>
        </View>
        {items.map((item, index) => {
          const product = inventoryItems.find(p => p.id === item.productId);
          const VAT_RATE = 0.15;
          const vatPerUnit = item.unitPrice * VAT_RATE;
          const totalVatValue = vatPerUnit * item.quantity;
          
          return (
            <View key={index} style={isRTL ? styles.tableRowRTL : styles.tableRow}>
              <Text style={styles.tableCellNarrow}>{index + 1}</Text>
              <Text style={styles.tableCell}>{product?.barcode || item.productId.slice(0, 8)}</Text>
              <Text style={styles.tableCellWide}>{getProductName(item.productId)}</Text>
              <Text style={styles.tableCell}>{item.quantity || 0}</Text>
              <Text style={styles.tableCell}>
                {isRTL ? `${formatNumber(item.unitPrice)} ${currency}` : `${currency} ${formatNumber(item.unitPrice)}`}
              </Text>
              <Text style={styles.tableCell}>
                {isRTL ? `${formatNumber(vatPerUnit)} ${currency}` : `${currency} ${formatNumber(vatPerUnit)}`}
              </Text>
              <Text style={styles.tableCell}>
                {isRTL ? `${formatNumber(totalVatValue)} ${currency}` : `${currency} ${formatNumber(totalVatValue)}`}
              </Text>
              <Text style={styles.tableCell}>
                {isRTL ? `${formatNumber(item.subtotal)} ${currency}` : `${currency} ${formatNumber(item.subtotal)}`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
