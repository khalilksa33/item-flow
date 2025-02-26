
import { Text, View } from '@react-pdf/renderer';
import { InvoiceItem } from '@/types/inventory';
import { styles } from './styles';
import { storage } from '@/lib/storage';
import { useTranslation } from 'react-i18next';

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  currency: string;
  formatNumber: (value: number | undefined) => string;
  isRTL?: boolean;
}

export function InvoiceItemsTable({ items, currency, formatNumber, isRTL = false }: InvoiceItemsTableProps) {
  const { t } = useTranslation("invoices");
  
  // Get all inventory items to map product IDs to names
  const inventoryItems = storage.getItems();
  
  // Function to get product name from ID
  const getProductName = (productId: string): string => {
    const product = inventoryItems.find(item => item.id === productId);
    return product ? product.name : productId; // Fallback to ID if product not found
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("items")}</Text>
      <View style={styles.table}>
        <View style={isRTL ? styles.tableHeaderRTL : styles.tableHeader}>
          <Text style={styles.tableCellNarrow}>#</Text>
          <Text style={styles.tableCellWide}>{t("item")}</Text>
          <Text style={styles.tableCell}>{t("quantity")}</Text>
          <Text style={styles.tableCell}>{t("unitPrice")}</Text>
          <Text style={styles.tableCell}>{t("subtotal")}</Text>
        </View>
        {items.map((item, index) => (
          <View key={index} style={isRTL ? styles.tableRowRTL : styles.tableRow}>
            <Text style={styles.tableCellNarrow}>{index + 1}</Text>
            <Text style={styles.tableCellWide}>{getProductName(item.productId)}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{currency} {formatNumber(item.unitPrice)}</Text>
            <Text style={styles.tableCell}>{currency} {formatNumber(item.subtotal)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
