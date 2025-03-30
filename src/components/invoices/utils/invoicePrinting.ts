
import { Invoice } from "@/types/inventory";
import { toast } from "sonner";

import { applyLanguageSettings } from "./printing/formatUtils";
import { generateInvoiceHTML } from "./printing/invoiceTemplate";
import { generateReceiptHTML } from "./printing/receiptTemplate";

/**
 * Print an invoice or receipt document in a new window
 */
export const printDocument = (
  invoice: Invoice, 
  customerName: string, 
  type: "invoice" | "receipt", 
  isRTL: boolean, 
  t: (key: string) => string
) => {
  try {
    // Set language and direction
    applyLanguageSettings(isRTL);
    console.log(`Printing ${type} with language: ${isRTL ? 'ar' : 'en'}, isRTL: ${isRTL}`);

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error(t("invoices:popupBlocked"));
      return;
    }

    // Generate the appropriate document HTML based on type
    const documentHTML = type === 'invoice'
      ? generateInvoiceHTML(invoice, customerName, isRTL)
      : generateReceiptHTML(invoice, customerName, isRTL);

    // Write the content to the print window
    printWindow.document.write(documentHTML);
    printWindow.document.close();
    
    // Trigger print after content is loaded
    printWindow.onload = () => {
      printWindow.focus();
      // Use a slightly longer delay to ensure fonts are loaded
      setTimeout(() => {
        printWindow.print();
      }, 1500);
    };
  } catch (error) {
    console.error('Error printing document:', error);
    toast.error(`Error printing ${type}`);
  }
};
