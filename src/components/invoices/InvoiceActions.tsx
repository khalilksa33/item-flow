
import { useState } from "react";
import { Invoice, Customer } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/documents/InvoicePDF";
import { ReceiptPDF } from "@/components/documents/ReceiptPDF";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FilePenLine, MoreHorizontal, Trash, Printer, FileDown, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InvoiceActionsProps {
  invoice: Invoice;
  customers: Customer[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

export function InvoiceActions({ invoice, customers, onEdit, onDelete }: InvoiceActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<"invoice" | "receipt">("invoice");
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';

  const customerName = customers.find(c => c.id === invoice.customerId)?.name || t("invoices:unknownCustomer");

  const handlePrint = (e: React.MouseEvent, type: "invoice" | "receipt") => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Force set language in localStorage before printing to ensure proper rendering
      localStorage.setItem('preferredLanguage', i18n.language);
      
      // Open a new window for printing
      const printWindow = window.open('', '_blank');
      
      if (!printWindow) {
        toast.error(t("invoices:popupBlocked"));
        return;
      }
      
      // Write the necessary HTML to the new window
      printWindow.document.write(`
        <html ${isRTL ? 'dir="rtl" lang="ar"' : 'dir="ltr" lang="en"'}>
          <head>
            <title>${type === "invoice" ? t("invoices:printInvoice") : t("invoices:printReceipt")}</title>
            <style>
              body { margin: 0; }
              iframe { width: 100%; height: 100vh; border: none; }
            </style>
          </head>
          <body>
            <div id="pdf-container"></div>
            <script>
              // Notify that the window is ready to receive the PDF
              window.onload = function() {
                window.opener.postMessage('readyForPDF', '*');
              };
            </script>
          </body>
        </html>
      `);
      
      // Listen for the window's ready message
      const messageListener = (event: MessageEvent) => {
        if (event.data === 'readyForPDF') {
          // Remove the listener to avoid duplicates
          window.removeEventListener('message', messageListener);
          
          // Create a local URL for embedding in the new window
          const blob = new Blob([
            `<iframe src="/invoices/${invoice.id}/${type}" width="100%" height="100%" frameborder="0"></iframe>`
          ], { type: 'text/html' });
          const blobUrl = URL.createObjectURL(blob);
          
          // Replace the content with an iframe that loads the PDF
          printWindow.document.getElementById('pdf-container')!.innerHTML = `
            <iframe src="${blobUrl}" onload="setTimeout(function() { window.print(); }, 1500);"></iframe>
          `;
        }
      };
      
      window.addEventListener('message', messageListener);
    } catch (error) {
      console.error("Print error:", error);
      toast.error(t("common:errorOccurred"));
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(t("common:confirmDelete"))) {
      onDelete(invoice.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(invoice);
  };

  const handleViewInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Force set language in localStorage before viewing
    localStorage.setItem('preferredLanguage', i18n.language);
    setPreviewType("invoice");
    setIsViewOpen(true);
  };

  const handleViewReceipt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Force set language in localStorage before viewing
    localStorage.setItem('preferredLanguage', i18n.language);
    setPreviewType("receipt");
    setIsViewOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? "start" : "end"}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <DropdownMenuItem onClick={handleEdit}>
            <FilePenLine className="mr-2 h-4 w-4" />
            {t("common:edit")}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleViewInvoice}>
            <Eye className="mr-2 h-4 w-4" />
            {t("invoices:viewInvoice")}
          </DropdownMenuItem>
          
          {invoice.status === 'paid' && (
            <DropdownMenuItem onClick={handleViewReceipt}>
              <Eye className="mr-2 h-4 w-4" />
              {t("invoices:viewReceipt")}
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={(e) => handlePrint(e, "invoice")}>
            <Printer className="mr-2 h-4 w-4" />
            {t("invoices:printInvoice")}
          </DropdownMenuItem>
          
          {invoice.status === 'paid' && (
            <DropdownMenuItem onClick={(e) => handlePrint(e, "receipt")}>
              <Printer className="mr-2 h-4 w-4" />
              {t("invoices:printReceipt")}
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <div className="flex items-center w-full">
              <PDFDownloadLink
                document={<InvoicePDF invoice={invoice} customerName={customerName} />}
                fileName={`invoice-${invoice.id.slice(0, 8)}.pdf`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center w-full"
              >
                <FileDown className="mr-2 h-4 w-4" />
                {t("invoices:downloadInvoice")}
              </PDFDownloadLink>
            </div>
          </DropdownMenuItem>
          
          {invoice.status === 'paid' && (
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <div className="flex items-center w-full">
                <PDFDownloadLink
                  document={<ReceiptPDF invoice={invoice} customerName={customerName} />}
                  fileName={`receipt-${invoice.id.slice(0, 8)}.pdf`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center w-full"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  {t("invoices:downloadReceipt")}
                </PDFDownloadLink>
              </div>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            {t("common:delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-6xl h-5/6 flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {previewType === "invoice" ? t("invoices:viewInvoice") : t("invoices:viewReceipt")}
            </DialogTitle>
            <DialogDescription>
              {t("invoices:customerName")}: {customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <PDFViewer width="100%" height="100%" className="border rounded">
              {previewType === "invoice" ? (
                <InvoicePDF invoice={invoice} customerName={customerName} />
              ) : (
                <ReceiptPDF invoice={invoice} customerName={customerName} />
              )}
            </PDFViewer>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
