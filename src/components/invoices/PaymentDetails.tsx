
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

interface PaymentDetailsProps {
  paymentDue: string;
  paymentTerms: string;
  onPaymentDueChange: (value: string) => void;
  onPaymentTermsChange: (value: string) => void;
}

export function PaymentDetails({
  paymentDue,
  paymentTerms,
  onPaymentDueChange,
  onPaymentTermsChange,
}: PaymentDetailsProps) {
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="paymentDue" className={isRTL ? "text-right block" : "block"}>
          {t("invoices:dueDate")}
        </Label>
        <Input
          id="paymentDue"
          type="date"
          value={paymentDue}
          onChange={(e) => onPaymentDueChange(e.target.value)}
          className={isRTL ? "text-right" : ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="paymentTerms" className={isRTL ? "text-right block" : "block"}>
          {t("invoices:paymentTerms")}
        </Label>
        <Input
          id="paymentTerms"
          value={paymentTerms}
          onChange={(e) => onPaymentTermsChange(e.target.value)}
          placeholder={isRTL ? "على سبيل المثال، صافي 30، مستحق عند الاستلام" : "e.g., Net 30, Due on Receipt"}
          className={isRTL ? "text-right" : ""}
        />
      </div>
    </div>
  );
}
