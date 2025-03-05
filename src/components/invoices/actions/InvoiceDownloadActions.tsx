
import { Invoice } from "@/types/inventory";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/documents/InvoicePDF";
import { ReceiptPDF } from "@/components/documents/ReceiptPDF";
import { FileDown } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InvoiceDownloadActionsProps {
  invoice: Invoice;
  customerName: string;
}

export const InvoiceDownloadActions = ({ invoice, customerName }: InvoiceDownloadActionsProps) => {
  const { t } = useTranslation(["invoices"]);

  return (
    <>
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
    </>
  );
};
