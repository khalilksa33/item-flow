
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
import { Invoice, InvoiceItem, Customer, InventoryItem, Quotation } from "@/types/inventory";
import { toast } from "sonner";

export function InvoicesManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [customers] = useState<Customer[]>(storage.getCustomers());
  const [products] = useState<InventoryItem[]>(storage.getItems());
  const [quotations] = useState<Quotation[]>(storage.getQuotations());
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedQuotation, setSelectedQuotation] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [paymentDue, setPaymentDue] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    setInvoices(storage.getInvoices());
  };

  const calculateTotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      productId: "",
      quantity: 1,
      unitPrice: 0,
      subtotal: 0
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
        item.subtotal = item.quantity * item.unitPrice;
      }
    } else if (field === 'quantity') {
      item.quantity = Number(value);
      item.subtotal = item.quantity * item.unitPrice;
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
    
    const invoiceData: Invoice = {
      id: editingInvoice?.id || crypto.randomUUID(),
      customerId: selectedCustomer,
      quotationId: selectedQuotation || undefined,
      items: invoiceItems,
      total: calculateTotal(invoiceItems),
      status: 'draft',
      paymentStatus: 'unpaid',
      paymentDue,
      paymentTerms,
      notes,
      createdAt: editingInvoice?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    if (editingInvoice) {
      storage.updateInvoice(invoiceData);
      toast.success("Invoice updated successfully");
    } else {
      storage.addInvoice(invoiceData);
      toast.success("Invoice created successfully");
    }

    loadInvoices();
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCustomer("");
    setSelectedQuotation("");
    setInvoiceItems([]);
    setPaymentDue("");
    setPaymentTerms("");
    setNotes("");
    setEditingInvoice(null);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setSelectedCustomer(invoice.customerId);
    setSelectedQuotation(invoice.quotationId || "");
    setInvoiceItems(invoice.items);
    setPaymentDue(invoice.paymentDue);
    setPaymentTerms(invoice.paymentTerms || "");
    setNotes(invoice.notes || "");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteInvoice(id);
    loadInvoices();
    toast.success("Invoice deleted successfully");
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
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Button onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          New Invoice
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{new Date(invoice.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{getCustomerName(invoice.customerId)}</TableCell>
              <TableCell>${invoice.total.toFixed(2)}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                  invoice.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status}
                </span>
              </TableCell>
              <TableCell>{new Date(invoice.paymentDue).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(invoice)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(invoice.id)}
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
              {editingInvoice ? "Edit Invoice" : "New Invoice"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
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
                          {getCustomerName(quotation.customerId)} - ${quotation.total}
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
                  <div key={item.id} className="grid grid-cols-3 gap-2 mb-2">
                    <select
                      className="rounded-md border border-input bg-background px-3 py-2"
                      value={item.productId}
                      onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ${product.cost}
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      placeholder="Quantity"
                      required
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Subtotal: ${item.subtotal.toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const updatedItems = invoiceItems.filter((_, i) => i !== index);
                          setInvoiceItems(updatedItems);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
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

              <div className="text-right text-lg font-semibold">
                Total: ${calculateTotal(invoiceItems).toFixed(2)}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingInvoice ? "Update" : "Create"} Invoice
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
