
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceFormProps } from "./types";
import { InvoiceItem } from "@/types/inventory";
import { InvoiceItemRow } from "./InvoiceItemRow";
import { CustomerQuotationSelect } from "./CustomerQuotationSelect";
import { PaymentDetails } from "./PaymentDetails";
import { InvoiceTotals } from "./InvoiceTotals";

const VAT_RATE = 0.15;

export function InvoiceForm({
  editingInvoice,
  customers,
  products,
  quotations,
  onSubmit,
  onCancel
}: InvoiceFormProps) {
  const [selectedCustomer, setSelectedCustomer] = useState(editingInvoice?.customerId || "");
  const [selectedQuotation, setSelectedQuotation] = useState(editingInvoice?.quotationId || "");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>(
    editingInvoice?.items || []
  );
  const [paymentDue, setPaymentDue] = useState(editingInvoice?.paymentDue || "");
  const [paymentTerms, setPaymentTerms] = useState(editingInvoice?.paymentTerms || "");
  const [notes, setNotes] = useState(editingInvoice?.notes || "");

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const vat = subtotal * VAT_RATE;
    return { subtotal, vat };
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const vatAmount = subtotal * VAT_RATE;
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      productId: "",
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      vat: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...invoiceItems];
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
    setInvoiceItems(updatedItems);
  };

  const handleQuotationSelect = (quotationId: string) => {
    const quotation = quotations.find(q => q.id === quotationId);
    if (quotation) {
      setSelectedCustomer(quotation.customerId);
      setInvoiceItems(quotation.items.map(item => ({
        ...item,
        id: crypto.randomUUID()
      })));
      setSelectedQuotation(quotationId);
    } else {
      setSelectedQuotation("");
      setInvoiceItems([]);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomer(customerId);
    setSelectedQuotation(""); // Reset quotation when customer changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { subtotal, vatAmount, total } = calculateTotals(invoiceItems);

    onSubmit({
      customerId: selectedCustomer,
      quotationId: selectedQuotation || undefined,
      items: invoiceItems,
      subtotal,
      vatRate: VAT_RATE,
      vatAmount,
      total,
      paymentDue,
      paymentTerms,
      notes
    });
  };

  const totals = calculateTotals(invoiceItems);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CustomerQuotationSelect
        customers={customers}
        quotations={quotations}
        selectedCustomer={selectedCustomer}
        selectedQuotation={selectedQuotation}
        onCustomerChange={handleCustomerChange}
        onQuotationChange={handleQuotationSelect}
      />

      <PaymentDetails
        paymentDue={paymentDue}
        paymentTerms={paymentTerms}
        onPaymentDueChange={setPaymentDue}
        onPaymentTermsChange={setPaymentTerms}
      />

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Items</Label>
          <Button type="button" onClick={handleAddItem} size="sm">
            Add Item
          </Button>
        </div>
        {invoiceItems.map((item, index) => (
          <InvoiceItemRow
            key={item.id}
            item={item}
            products={products}
            onItemChange={(field, value) => handleItemChange(index, field, value)}
            onRemove={() => {
              const updatedItems = invoiceItems.filter((_, i) => i !== index);
              setInvoiceItems(updatedItems);
            }}
          />
        ))}
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <InvoiceTotals
        subtotal={totals.subtotal}
        vatAmount={totals.vatAmount}
        total={totals.total}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editingInvoice ? "Update" : "Create"} Invoice
        </Button>
      </div>
    </form>
  );
}
