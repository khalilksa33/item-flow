
import { Invoice } from "@/types/inventory";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { printDocument } from "../utils/invoicePrinting";
import { useEffect } from "react";

interface InvoicePrintActionsProps {
  invoice: Invoice;
  customerName: string;
}

export const InvoicePrintActions = ({ invoice, customerName }: InvoicePrintActionsProps) => {
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';

  // Sync language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', isRTL ? 'ar' : 'en');
  }, [i18n.language, isRTL]);

  const handlePrint = (e: React.MouseEvent, type: "invoice" | "receipt") => {
    e.preventDefault();
    e.stopPropagation();
    
    // Make sure language is set correctly before printing
    localStorage.setItem('preferredLanguage', isRTL ? 'ar' : 'en');
    console.log(`Print ${type} in language: ${isRTL ? 'Arabic' : 'English'}`);
    
    printDocument(invoice, customerName, type, isRTL, t);
  };

  return (
    <>
      <DropdownMenuItem onClick={(e) => handlePrint(e, "invoice")}>
        <Printer className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
        {t("invoices:printInvoice")}
      </DropdownMenuItem>
      
      {invoice.status === 'paid' && (
        <DropdownMenuItem onClick={(e) => handlePrint(e, "receipt")}>
          <Printer className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
          {t("invoices:printReceipt")}
        </DropdownMenuItem>
      )}
    </>
  );
};
