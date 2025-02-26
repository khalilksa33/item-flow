
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuotationItemProps } from "./types";
import { useTranslation } from "react-i18next";

export function QuotationItemRow({ item, products, onItemChange, onRemove }: QuotationItemProps) {
  const { t, i18n } = useTranslation(["quotations", "common"]);
  const isRTL = i18n.language === 'ar';
  
  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem('currency') || 'SAR';
    return isRTL 
      ? `${amount.toFixed(2)} ${currency}` 
      : `${currency} ${amount.toFixed(2)}`;
  };

  return (
    <div className={`grid grid-cols-4 gap-2 mb-2 ${isRTL ? "dir-rtl" : ""}`}>
      <select
        className={`rounded-md border border-input bg-background px-3 py-2 ${isRTL ? "text-right" : "text-left"}`}
        value={item.productId}
        onChange={(e) => onItemChange('productId', e.target.value)}
        required
      >
        <option value="">{t("quotations:selectProduct")}</option>
        {products.map(product => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </select>
      <Input
        type="number"
        min="0"
        step="0.01"
        value={item.unitPrice}
        onChange={(e) => onItemChange('unitPrice', e.target.value)}
        placeholder={t("quotations:unitPrice")}
        className={isRTL ? "text-right" : "text-left"}
        required
      />
      <Input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) => onItemChange('quantity', e.target.value)}
        placeholder={t("quotations:quantity")}
        className={isRTL ? "text-right" : "text-left"}
        required
      />
      <div className="flex items-center gap-2">
        <div className={`text-sm space-y-1 ${isRTL ? "text-right" : "text-left"}`}>
          <div className="text-gray-600">
            {t("quotations:subtotal")}: {formatCurrency(item.subtotal)}
          </div>
          <div className="text-gray-600">
            {t("quotations:vat")} (15%): {formatCurrency(item.vat)}
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
        >
          {t("common:delete")}
        </Button>
      </div>
    </div>
  );
}
