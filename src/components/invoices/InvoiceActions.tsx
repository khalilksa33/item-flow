
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, MoreHorizontal, Printer, Receipt, Pencil, Trash } from "lucide-react";
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
  const customerName = customers.find(c => c.id === invoice.customerId)?.name || t("unknownCustomer");

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
      toast.error(t("popupBlocked"));
      
      // Provide fallback download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `invoice-${Date.now()}.pdf`;
      link.click();
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    }
  };

  const renderPrintButton = (type: 'invoice' | 'receipt' = 'invoice') => {
    const Document = type === 'invoice' 
      ? <InvoicePDF invoice={invoice} customerName={customerName} />
      : <ReceiptPDF invoice={invoice} customerName={customerName} />;
    
    return (
      <BlobProvider document={Document}>
        {({ blob, loading, error }) => (
          <DropdownMenuItem
            disabled={loading || !!error}
            onClick={() => blob && handlePrintDocument(blob)}
          >
            {type === 'invoice' ? (
              <Printer className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            ) : (
              <Receipt className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            )}
            {type === 'invoice' ? t("printInvoice") : t("printReceipt")}
          </DropdownMenuItem>
        )}
      </BlobProvider>
    );
  };

  const renderDownloadButton = (type: 'invoice' | 'receipt' = 'invoice') => {
    const Document = type === 'invoice' 
      ? <InvoicePDF invoice={invoice} customerName={customerName} />
      : <ReceiptPDF invoice={invoice} customerName={customerName} />;
    
    return (
      <PDFDownloadLink
        document={Document}
        fileName={`${type}-${invoice.id.slice(0, 8)}.pdf`}
        style={{ textDecoration: 'none' }}
      >
        {({ loading }) => (
          <DropdownMenuItem disabled={loading}>
            <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {type === 'invoice' ? t("downloadInvoice") : t("downloadReceipt")}
          </DropdownMenuItem>
        )}
      </PDFDownloadLink>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? "start" : "end"}>
        {renderPrintButton('invoice')}
        {renderDownloadButton('invoice')}
        {invoice.status === 'paid' && renderPrintButton('receipt')}
        {invoice.status === 'paid' && renderDownloadButton('receipt')}
        <DropdownMenuItem onClick={() => onEdit(invoice)}>
          <Pencil className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("common:edit")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(invoice.id)}>
          <Trash className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("common:delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
