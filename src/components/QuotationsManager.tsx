import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { storage } from "@/lib/storage";
import { Quotation, QuotationItem, Customer, InventoryItem } from "@/types/inventory";
import { toast } from "sonner";

export function QuotationsManager() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [customers] = useState<Customer[]>(storage.getCustomers());
  const [products] = useState<InventoryItem[]>(storage.getItems());
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [validUntil, setValidUntil] = useState("");
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [VAT_RATE, setVAT_RATE] = useState(0.15);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = () => {
    setQuotations(storage.getQuotations());
  };

  const calculateTotal = (items: QuotationItem[]) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

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
      subtotal: 0
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
    } else if (field === 'quantity') {
      item.quantity = Number(value);
      const { subtotal, vat } = calculateItemTotal(item);
      item.subtotal = subtotal;
      item.vat = vat;
    } else if (field === 'unitPrice') {
      item.unitPrice = Number(value);
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
    
    const quotationData: Quotation = {
      id: editingQuotation?.id || crypto.randomUUID(),
      customerId: selectedCustomer,
      items: quotationItems,
      subtotal,
      vatRate: VAT_RATE,
      vatAmount,
      total,
      status: 'draft',
      validUntil,
      notes,
      terms,
      createdAt: editingQuotation?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    if (editingQuotation) {
      storage.updateQuotation(quotationData);
      toast.success("Quotation updated successfully");
    } else {
      storage.addQuotation(quotationData);
      toast.success("Quotation created successfully");
    }

    loadQuotations();
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCustomer("");
    setQuotationItems([]);
    setValidUntil("");
    setNotes("");
    setTerms("");
    setEditingQuotation(null);
  };

  const handleEdit = (quotation: Quotation) => {
    setEditingQuotation(quotation);
    setSelectedCustomer(quotation.customerId);
    setQuotationItems(quotation.items);
    setValidUntil(quotation.validUntil);
    setNotes(quotation.notes || "");
    setTerms(quotation.terms || "");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteQuotation(id);
    loadQuotations();
    toast.success("Quotation deleted successfully");
  };

  const getCustomerName = (customerId: string) => {
    return customers.find(c => c.id === customerId)?.name || 'Unknown Customer';
  };

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || 'Unknown Product';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quotations</h2>
        <Button onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          New Quotation
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Valid Until</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotations.map((quotation) => (
            <TableRow key={quotation.id}>
              <TableCell>{new Date(quotation.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{getCustomerName(quotation.customerId)}</TableCell>
              <TableCell>${quotation.total.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  quotation.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  quotation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  quotation.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {quotation.status}
                </span>
              </TableCell>
              <TableCell>{new Date(quotation.validUntil).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(quotation)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(quotation.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuotation ? "Edit Quotation" : "New Quotation"}
            </DialogTitle>
          </DialogHeader>
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
                  <div key={item.id} className="grid grid-cols-4 gap-2 mb-2">
                    <select
                      className="rounded-md border border-input bg-background px-3 py-2"
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
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
                      onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      placeholder="Unit Price"
                      required
                    />
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <div className="text-sm space-y-1">
                        <div className="text-gray-600">
                          Subtotal: ${item.subtotal.toFixed(2)}
                        </div>
                        <div className="text-gray-600">
                          VAT (15%): ${item.vat.toFixed(2)}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const updatedItems = quotationItems.filter((_, i) => i !== index);
                          setQuotationItems(updatedItems);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
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
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingQuotation ? "Update" : "Create"} Quotation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
