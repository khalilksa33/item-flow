
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer, Quotation } from "@/types/inventory";
import { useTranslation } from "react-i18next";

interface CustomerQuotationSelectProps {
  customers: Customer[];
  quotations: Quotation[];
  selectedCustomer: string;
  selectedQuotation: string;
  onCustomerChange: (customerId: string) => void;
  onQuotationChange: (quotationId: string) => void;
}

export function CustomerQuotationSelect({
  customers,
  quotations,
  selectedCustomer,
  selectedQuotation,
  onCustomerChange,
  onQuotationChange,
}: CustomerQuotationSelectProps) {
  const { t, i18n } = useTranslation(["invoices", "common", "customers", "quotations"]);
  const isRTL = i18n.language === 'ar';

  // Filter quotations by selected customer
  const customerQuotations = quotations.filter(
    (q) => q.customerId === selectedCustomer
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="customer" className={isRTL ? "text-right block" : "block"}>
          {t("customers:title")}
        </Label>
        <select
          id="customer"
          value={selectedCustomer}
          onChange={(e) => onCustomerChange(e.target.value)}
          className="w-full rounded-md border border-input px-3 py-2"
          required
        >
          <option value="">{t("invoices:selectCustomer", "Select a customer")}</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      {selectedCustomer && customerQuotations.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="quotation" className={isRTL ? "text-right block" : "block"}>
            {t("quotations:title")} ({t("common:optional")})
          </Label>
          <select
            id="quotation"
            value={selectedQuotation}
            onChange={(e) => onQuotationChange(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
          >
            <option value="">{t("invoices:noQuotation", "No quotation")}</option>
            {customerQuotations.map((quotation) => (
              <option key={quotation.id} value={quotation.id}>
                {t("quotations:ref")}: {quotation.id.slice(0, 8)} ({new Date(quotation.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
