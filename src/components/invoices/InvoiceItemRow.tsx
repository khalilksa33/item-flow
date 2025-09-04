
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { InvoiceItem, InventoryItem } from "@/types/inventory";
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InvoiceItemRowProps {
  item: InvoiceItem;
  products: InventoryItem[];
  onItemChange: (field: keyof InvoiceItem, value: any) => void;
  onRemove: () => void;
}

export function InvoiceItemRow({
  item,
  products,
  onItemChange,
  onRemove,
}: InvoiceItemRowProps) {
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';
  
  const currency = localStorage.getItem('currency') || 'SAR';

  const VAT_RATE = 0.15;
  const vatPerUnit = item.unitPrice * VAT_RATE;
  const totalVatValue = vatPerUnit * item.quantity;

  return (
    <div className={`grid grid-cols-14 gap-2 mb-2 items-center ${isRTL ? "dir-rtl" : ""}`}>
      <div className="col-span-3">
        <select
          value={item.productId}
          onChange={(e) => onItemChange("productId", e.target.value)}
          className="w-full rounded-md border border-input px-3 py-2 text-sm"
        >
          <option value="">{t("invoices:selectProduct", "Select Product")}</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.barcode ? `[${product.barcode}] ` : ''}
              {product.name} ({isRTL ? `${product.cost} ${currency}` : `${currency} ${product.cost}`})
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2">
        <Input
          type="text"
          value={products.find(p => p.id === item.productId)?.barcode || ''}
          placeholder={isRTL ? "كود الصنف" : "Item Code"}
          className={`${isRTL ? "text-right" : ""} bg-gray-50`}
          readOnly
        />
      </div>
      <div className="col-span-1">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onItemChange("quantity", e.target.value)}
          placeholder={t("invoices:quantity", "Qty")}
          className={isRTL ? "text-right" : ""}
        />
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={item.unitPrice}
          onChange={(e) => onItemChange("unitPrice", e.target.value)}
          placeholder={t("invoices:unitPrice", "Price")}
          className={isRTL ? "text-right" : ""}
        />
      </div>
      <div className="col-span-2 text-center">
        <span className="text-sm">
          {isRTL 
            ? `${vatPerUnit.toFixed(2)} ${currency}` 
            : `${currency} ${vatPerUnit.toFixed(2)}`}
        </span>
      </div>
      <div className="col-span-2 text-center">
        <span className="text-sm">
          {isRTL 
            ? `${totalVatValue.toFixed(2)} ${currency}` 
            : `${currency} ${totalVatValue.toFixed(2)}`}
        </span>
      </div>
      <div className="col-span-1 text-center">
        <span>
          {isRTL 
            ? `${item.subtotal.toFixed(2)} ${currency}` 
            : `${currency} ${item.subtotal.toFixed(2)}`}
        </span>
      </div>
      <div className="col-span-1 text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-red-500 hover:text-red-700"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
