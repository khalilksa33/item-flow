
import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { Download, Printer, Receipt } from "lucide-react";
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
  const { t } = useTranslation(["invoices", "common"]);
  const customerName = customers.find(c => c.id === invoice.customerId)?.name || t("unknownCustomer", "Unknown Customer");

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
      toast.error(t("popupBlocked", "Pop-up blocked. Please allow pop-ups to print directly."));
      
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
            {type === 'invoice' ? t("printInvoice", "Print Invoice") : t("printReceipt", "Print Receipt")}
          </Button>
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
      >
        {({ loading }) => (
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <Download className="h-4 w-4 mr-2" />
            {type === 'invoice' ? t("downloadInvoice", "Download Invoice") : t("downloadReceipt", "Download Receipt")}
          </Button>
        )}
      </PDFDownloadLink>
    );
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {renderPrintButton('invoice')}
      {renderDownloadButton('invoice')}
      {invoice.status === 'paid' && renderPrintButton('receipt')}
      {invoice.status === 'paid' && renderDownloadButton('receipt')}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(invoice)}
      >
        {t("common:edit")}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(invoice.id)}
      >
        {t("common:delete")}
      </Button>
    </div>
  );
}
