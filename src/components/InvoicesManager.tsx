
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { storage } from "@/lib/storage";
import { Invoice, Customer, InventoryItem, Quotation } from "@/types/inventory";
import { toast } from "sonner";
import { InvoiceForm } from "./invoices/InvoiceForm";

export function InvoicesManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [customers] = useState<Customer[]>(storage.getCustomers());
  const [products] = useState<InventoryItem[]>(storage.getItems());
  const [quotations] = useState<Quotation[]>(storage.getQuotations());

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    setInvoices(storage.getInvoices());
  };

  const handleSubmit = (data: Partial<Invoice>) => {
    const invoiceData: Invoice = {
      id: editingInvoice?.id || crypto.randomUUID(),
      ...data,
      status: 'draft',
      paymentStatus: 'unpaid',
      createdAt: editingInvoice?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    } as Invoice;

    if (editingInvoice) {
      storage.updateInvoice(invoiceData);
      toast.success("Invoice updated successfully");
    } else {
      storage.addInvoice(invoiceData);
      toast.success("Invoice created successfully");
    }

    loadInvoices();
    setIsDialogOpen(false);
    setEditingInvoice(null);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <Button onClick={() => {
          setEditingInvoice(null);
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInvoice ? "Edit Invoice" : "New Invoice"}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto pr-1">
            <InvoiceForm
              editingInvoice={editingInvoice}
              customers={customers}
              products={products}
              quotations={quotations}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
