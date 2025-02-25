
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="paymentDue">Payment Due Date</Label>
        <Input
          id="paymentDue"
          type="date"
          value={paymentDue}
          onChange={(e) => onPaymentDueChange(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="paymentTerms">Payment Terms</Label>
        <Input
          id="paymentTerms"
          value={paymentTerms}
          onChange={(e) => onPaymentTermsChange(e.target.value)}
          placeholder="e.g., Net 30"
        />
      </div>
    </div>
  );
}
