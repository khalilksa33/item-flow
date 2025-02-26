
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuotationFormProps } from "./types";
import { QuotationItem } from "@/types/inventory";
import { QuotationItemRow } from "./QuotationItemRow";
import { useTranslation } from "react-i18next";

const VAT_RATE = 0.15;

export function QuotationForm({ 
  editingQuotation, 
  customers, 
  products, 
  onSubmit, 
  onCancel 
}: QuotationFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(editingQuotation?.customerId || "");
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>(
    editingQuotation?.items || []
  );
  const [validUntil, setValidUntil] = useState(editingQuotation?.validUntil || "");
  const [notes, setNotes] = useState(editingQuotation?.notes || "");
  const [terms, setTerms] = useState(editingQuotation?.terms || "");
  const { t, i18n } = useTranslation(["quotations", "common"]);
  const isRTL = i18n.language === 'ar';

  const calculateItemTotal = (item: QuotationItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const vat = subtotal * VAT_RATE;
    return { subtotal, vat };
  };

  const calculateTotals = (items: QuotationItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const vatAmount = subtotal * VAT_RATE;
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  };

  const handleAddItem = () => {
    const newItem: QuotationItem = {
      id: crypto.randomUUID(),
      productId: "",
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      vat: 0
    };
    setQuotationItems([...quotationItems, newItem]);
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const updatedItems = [...quotationItems];
    const item = { ...updatedItems[index] };

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        item.productId = value;
        item.unitPrice = product.cost || 0;
        const { subtotal, vat } = calculateItemTotal(item);
        item.subtotal = subtotal;
        item.vat = vat;
      }
    } else if (field === 'quantity' || field === 'unitPrice') {
      item[field] = Number(value);
      const { subtotal, vat } = calculateItemTotal(item);
      item.subtotal = subtotal;
      item.vat = vat;
    }

    updatedItems[index] = item;
    setQuotationItems(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { subtotal, vatAmount, total } = calculateTotals(quotationItems);
    
    onSubmit({
      customerId: selectedCustomer,
      items: quotationItems,
      subtotal,
      vatRate: VAT_RATE,
      vatAmount,
      total,
      validUntil,
      notes,
      terms
    });
  };

  const formatCurrency = (amount: number) => {
    const currency = localStorage.getItem('currency') || 'SAR';
    return isRTL 
      ? `${amount.toFixed(2)} ${currency}` 
      : `${currency} ${amount.toFixed(2)}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="customer" className={isRTL ? "text-right block" : "text-left block"}>
            {t("quotations:customer")}
          </Label>
          <select
            id="customer"
            className={`w-full rounded-md border border-input bg-background px-3 py-2 ${isRTL ? "text-right" : "text-left"}`}
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            required
          >
            <option value="">{t("quotations:selectCustomer")}</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="validUntil" className={isRTL ? "text-right block" : "text-left block"}>
            {t("quotations:validUntil")}
          </Label>
          <Input
            id="validUntil"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
            dir="ltr" // Dates are always LTR
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className={isRTL ? "text-right" : "text-left"}>{t("quotations:items")}</Label>
            <Button type="button" onClick={handleAddItem} size="sm">
              {t("common:add")}
            </Button>
          </div>
          {quotationItems.map((item, index) => (
            <QuotationItemRow
              key={item.id}
              item={item}
              products={products}
              onItemChange={(field, value) => handleItemChange(index, field, value)}
              onRemove={() => {
                const updatedItems = quotationItems.filter((_, i) => i !== index);
                setQuotationItems(updatedItems);
              }}
            />
          ))}
        </div>

        <div>
          <Label htmlFor="terms" className={isRTL ? "text-right block" : "text-left block"}>
            {t("quotations:terms")}
          </Label>
          <Input
            id="terms"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>

        <div>
          <Label htmlFor="notes" className={isRTL ? "text-right block" : "text-left block"}>
            {t("quotations:notes")}
          </Label>
          <Input
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>

        <div className={`text-${isRTL ? "left" : "right"} space-y-1`}>
          <div className="text-gray-600">
            {t("quotations:subtotal")}: {formatCurrency(calculateTotals(quotationItems).subtotal)}
          </div>
          <div className="text-gray-600">
            {t("quotations:vat")} (15%): {formatCurrency(calculateTotals(quotationItems).vatAmount)}
          </div>
          <div className="text-lg font-semibold">
            {t("quotations:total")}: {formatCurrency(calculateTotals(quotationItems).total)}
          </div>
        </div>
      </div>

      <div className={`flex justify-${isRTL ? "start" : "end"} gap-2`}>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common:cancel")}
        </Button>
        <Button type="submit">
          {editingQuotation ? t("common:update") : t("common:save")}
        </Button>
      </div>
    </form>
  );
}
