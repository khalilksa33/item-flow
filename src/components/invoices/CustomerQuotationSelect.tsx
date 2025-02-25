
import { Label } from "@/components/ui/label";
import { Customer, Quotation } from "@/types/inventory";

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
  // Filter accepted quotations for the selected customer
  const acceptedQuotations = quotations.filter(q => 
    q.status === 'accepted' && 
    (!selectedCustomer || q.customerId === selectedCustomer)
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="customer">Customer</Label>
        <select
          id="customer"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={selectedCustomer}
          onChange={(e) => onCustomerChange(e.target.value)}
          required
        >
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="quotation">From Quotation (Optional)</Label>
        <select
          id="quotation"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={selectedQuotation}
          onChange={(e) => onQuotationChange(e.target.value)}
        >
          <option value="">Select Quotation</option>
          {acceptedQuotations.map(quotation => {
            const customer = customers.find(c => c.id === quotation.customerId);
            return (
              <option key={quotation.id} value={quotation.id}>
                {customer?.name} - ${quotation.total.toFixed(2)}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
