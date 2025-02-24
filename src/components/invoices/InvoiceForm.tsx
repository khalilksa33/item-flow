
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InvoiceFormProps } from "./types";
import { InvoiceItem } from "@/types/inventory";
import { InvoiceItemRow } from "./InvoiceItemRow";

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
    }
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customer">Customer</Label>
          <select
            id="customer"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
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
            onChange={(e) => handleQuotationSelect(e.target.value)}
          >
            <option value="">Select Quotation</option>
            {quotations
              .filter(q => q.status === 'accepted')
              .map(quotation => (
                <option key={quotation.id} value={quotation.id}>
                  {customers.find(c => c.id === quotation.customerId)?.name} - ${quotation.total}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="paymentDue">Payment Due Date</Label>
          <Input
            id="paymentDue"
            type="date"
            value={paymentDue}
            onChange={(e) => setPaymentDue(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Input
            id="paymentTerms"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            placeholder="e.g., Net 30"
          />
        </div>
      </div>

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

      <div className="text-right space-y-1">
        <div className="text-gray-600">
          Subtotal: ${calculateTotals(invoiceItems).subtotal.toFixed(2)}
        </div>
        <div className="text-gray-600">
          VAT (15%): ${calculateTotals(invoiceItems).vatAmount.toFixed(2)}
        </div>
        <div className="text-lg font-semibold">
          Total: ${calculateTotals(invoiceItems).total.toFixed(2)}
        </div>
      </div>

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
