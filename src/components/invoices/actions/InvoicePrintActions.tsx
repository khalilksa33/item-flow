
import { Invoice } from "@/types/inventory";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { printDocument } from "../utils/invoicePrinting";

interface InvoicePrintActionsProps {
  invoice: Invoice;
  customerName: string;
}

export const InvoicePrintActions = ({ invoice, customerName }: InvoicePrintActionsProps) => {
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';

  const handlePrint = (e: React.MouseEvent, type: "invoice" | "receipt") => {
    e.preventDefault();
    e.stopPropagation();
    printDocument(invoice, customerName, type, isRTL, t);
  };

  return (
    <>
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
    </>
  );
};
