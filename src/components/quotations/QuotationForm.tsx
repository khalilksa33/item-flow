
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuotationFormProps } from "./types";
import { QuotationItem } from "@/types/inventory";
import { QuotationItemRow } from "./QuotationItemRow";

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
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
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            id="validUntil"
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Items</Label>
            <Button type="button" onClick={handleAddItem} size="sm">
              Add Item
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
          <Label htmlFor="terms">Terms & Conditions</Label>
          <Input
            id="terms"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
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
            Subtotal: ${calculateTotals(quotationItems).subtotal.toFixed(2)}
          </div>
          <div className="text-gray-600">
            VAT (15%): ${calculateTotals(quotationItems).vatAmount.toFixed(2)}
          </div>
          <div className="text-lg font-semibold">
            Total: ${calculateTotals(quotationItems).total.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editingQuotation ? "Update" : "Create"} Quotation
        </Button>
      </div>
    </form>
  );
}
