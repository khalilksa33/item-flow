
import { Invoice } from "@/types/inventory";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Printer } from "lucide-react";
import { useTranslation } from "react-i18next";
import { printDocument } from "../utils/invoicePrinting";
import { useEffect, useState } from "react";

interface InvoicePrintActionsProps {
  invoice: Invoice;
  customerName: string;
}

export const InvoicePrintActions = ({ invoice, customerName }: InvoicePrintActionsProps) => {
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');

  // Update RTL state when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const currentLang = i18n.language;
      const isArabic = currentLang === 'ar';
      setIsRTL(isArabic);
      
      console.log(`Setting language in localStorage: ${isArabic ? 'ar' : 'en'}`);
      localStorage.setItem('preferredLanguage', isArabic ? 'ar' : 'en');
    };
    
    handleLanguageChange();
    
    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const handlePrint = (e: React.MouseEvent, type: "invoice" | "receipt") => {
    e.preventDefault();
    e.stopPropagation();
    
    // Make sure language is set correctly before printing
    const currentLang = i18n.language;
    const isArabic = currentLang === 'ar';
    localStorage.setItem('preferredLanguage', isArabic ? 'ar' : 'en');
    console.log(`Print ${type} in language: ${isArabic ? 'Arabic' : 'English'}`);
    
    printDocument(invoice, customerName, type, isArabic, t);
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
