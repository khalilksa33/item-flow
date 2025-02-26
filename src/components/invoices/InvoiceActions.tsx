
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Download, Printer, Receipt, Pencil, Trash, FileText, Eye } from "lucide-react";
import { Invoice, Customer } from "@/types/inventory";
import { InvoicePDF } from "../documents/InvoicePDF";
import { ReceiptPDF } from "../documents/ReceiptPDF";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface InvoiceActionsProps {
  invoice: Invoice;
  customers: Customer[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

export function InvoiceActions({ invoice, customers, onEdit, onDelete }: InvoiceActionsProps) {
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';
  const customerName = customers.find(c => c.id === invoice.customerId)?.name || t("invoices:unknownCustomer");

  const handlePrintDocument = (blob: Blob) => {
    try {
      // Create a URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Open the PDF in a new tab
      const printWindow = window.open(blobUrl, '_blank');
      
      if (printWindow) {
        // Wait for the PDF to load then print
        printWindow.onload = () => {
          try {
            printWindow.print();
            // Clean up the blob URL after printing
            URL.revokeObjectURL(blobUrl);
          } catch (e) {
            console.error("Error during print:", e);
            toast.error(t("invoices:printError", "Error during printing"));
          }
        };
      } else {
        // If popup is blocked, just download the file
        toast.error(t("invoices:popupBlocked"));
        
        // Provide fallback download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `invoice-${Date.now()}.pdf`;
        link.click();
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      }
    } catch (e) {
      console.error("Error handling print document:", e);
      toast.error(t("invoices:printError", "Error handling document"));
    }
  };

  // Helper function to render a document view/print/download menu item
  const renderDocumentActions = (type: 'invoice' | 'receipt' = 'invoice') => {
    try {
      const Document = type === 'invoice' 
        ? <InvoicePDF invoice={invoice} customerName={customerName} />
        : <ReceiptPDF invoice={invoice} customerName={customerName} />;
      
      return (
        <>
          <DropdownMenuLabel className={isRTL ? "text-right" : ""}>
            {type === 'invoice' ? t("invoices:invoice") : t("invoices:receipt")}
          </DropdownMenuLabel>
          
          {/* View option */}
          <BlobProvider document={Document}>
            {({ blob, url, loading, error }) => (
              <DropdownMenuItem
                disabled={loading || !!error}
                onClick={() => {
                  if (url) {
                    try {
                      window.open(url, '_blank');
                    } catch (e) {
                      console.error("Error opening URL:", e);
                      toast.error(t("invoices:viewError", "Error viewing document"));
                    }
                  }
                }}
              >
                <Eye className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {type === 'invoice' ? t("invoices:viewInvoice") : t("invoices:viewReceipt")}
              </DropdownMenuItem>
            )}
          </BlobProvider>
          
          {/* Print option */}
          <BlobProvider document={Document}>
            {({ blob, loading, error }) => (
              <DropdownMenuItem
                disabled={loading || !!error}
                onClick={() => {
                  if (blob) {
                    try {
                      handlePrintDocument(blob);
                    } catch (e) {
                      console.error("Error in print handler:", e);
                      toast.error(t("invoices:printError", "Error printing document"));
                    }
                  }
                }}
              >
                <Printer className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {type === 'invoice' ? t("invoices:printInvoice") : t("invoices:printReceipt")}
              </DropdownMenuItem>
            )}
          </BlobProvider>
          
          {/* Download option */}
          <PDFDownloadLink
            document={Document}
            fileName={`${type}-${invoice.id.slice(0, 8)}.pdf`}
            style={{ textDecoration: 'none' }}
          >
            {({ loading, error }) => (
              <DropdownMenuItem disabled={loading || !!error}>
                <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {type === 'invoice' ? t("invoices:downloadInvoice") : t("invoices:downloadReceipt")}
              </DropdownMenuItem>
            )}
          </PDFDownloadLink>
        </>
      );
    } catch (e) {
      console.error("Error rendering document actions:", e);
      return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">{t("common:actions")}</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        <DropdownMenuItem onClick={() => onEdit(invoice)} className={isRTL ? "text-right" : ""}>
          <Pencil className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("common:edit")}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Invoice documents */}
        {renderDocumentActions('invoice')}
        
        {/* Receipt documents (only if paid) */}
        {invoice.status === 'paid' && (
          <>
            <DropdownMenuSeparator />
            {renderDocumentActions('receipt')}
          </>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => onDelete(invoice.id)}
          className={`text-red-600 hover:text-red-800 hover:bg-red-50 ${isRTL ? "text-right" : ""}`}
        >
          <Trash className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("common:delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
