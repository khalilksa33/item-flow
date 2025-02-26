
import { useTranslation } from "react-i18next";

interface InvoiceTotalsProps {
  subtotal: number;
  vatAmount: number;
  total: number;
}

export function InvoiceTotals({ subtotal, vatAmount, total }: InvoiceTotalsProps) {
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';
  
  const currency = localStorage.getItem('currency') || 'SAR';
  
  const formatCurrency = (amount: number) => {
    return isRTL 
      ? `${amount.toFixed(2)} ${currency}` 
      : `${currency} ${amount.toFixed(2)}`;
  };
  
  return (
    <div className={`w-full space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
      <div className="flex justify-between border-t pt-2">
        <span className="font-medium">{t("invoices:subtotal")}:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-medium">{t("invoices:vat")} (15%):</span>
        <span>{formatCurrency(vatAmount)}</span>
      </div>
      <div className="flex justify-between border-t border-b py-2 font-bold">
        <span>{t("invoices:total")}:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
