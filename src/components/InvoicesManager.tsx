
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
import { PDFDownloadLink, BlobProvider } from '@react-pdf/renderer';
import { Printer, Receipt, Download } from "lucide-react";
import { InvoicePDF } from "./documents/InvoicePDF";
import { ReceiptPDF } from "./documents/ReceiptPDF";

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

  const handlePrintDocument = (blob: Blob) => {
    // Create a URL for the blob
    const blobUrl = URL.createObjectURL(blob);
    
    // Open the PDF in a new tab
    const printWindow = window.open(blobUrl, '_blank');
    
    if (printWindow) {
      // Wait for the PDF to load then print
      printWindow.onload = () => {
        printWindow.print();
        // Clean up the blob URL after printing
        URL.revokeObjectURL(blobUrl);
      };
    } else {
      // If popup is blocked, just download the file
      toast.error("Pop-up blocked. Please allow pop-ups to print directly.");
      
      // Provide fallback download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `invoice-${Date.now()}.pdf`;
      link.click();
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    }
  };

  const renderPrintButton = (invoice: Invoice, type: 'invoice' | 'receipt' = 'invoice') => {
    const customerName = customers.find(c => c.id === invoice.customerId)?.name || 'Unknown Customer';
    const Document = type === 'invoice' 
      ? <InvoicePDF invoice={invoice} customerName={customerName} />
      : <ReceiptPDF invoice={invoice} customerName={customerName} />;
    
    return (
      <BlobProvider document={Document}>
        {({ blob, url, loading, error }) => (
          <Button
            variant="outline"
            size="sm"
            disabled={loading || !!error}
            onClick={() => blob && handlePrintDocument(blob)}
          >
            {type === 'invoice' ? (
              <Printer className="h-4 w-4 mr-2" />
            ) : (
              <Receipt className="h-4 w-4 mr-2" />
            )}
            {type === 'invoice' ? 'Print Invoice' : 'Print Receipt'}
          </Button>
        )}
      </BlobProvider>
    );
  };

  const renderDownloadButton = (invoice: Invoice, type: 'invoice' | 'receipt' = 'invoice') => {
    const customerName = customers.find(c => c.id === invoice.customerId)?.name || 'Unknown Customer';
    const Document = type === 'invoice' 
      ? <InvoicePDF invoice={invoice} customerName={customerName} />
      : <ReceiptPDF invoice={invoice} customerName={customerName} />;
    
    return (
      <PDFDownloadLink
        document={Document}
        fileName={`${type}-${invoice.id.slice(0, 8)}.pdf`}
      >
        {({ loading }) => (
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            {type === 'invoice' ? 'Download Invoice' : 'Download Receipt'}
          </Button>
        )}
      </PDFDownloadLink>
    );
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
                <div className="flex gap-2 flex-wrap">
                  {renderPrintButton(invoice, 'invoice')}
                  {renderDownloadButton(invoice, 'invoice')}
                  {invoice.status === 'paid' && renderPrintButton(invoice, 'receipt')}
                  {invoice.status === 'paid' && renderDownloadButton(invoice, 'receipt')}
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
