
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/documents/InvoicePDF";
import { ReceiptPDF } from "@/components/documents/ReceiptPDF";
import { Invoice } from "@/types/inventory";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";

interface InvoicePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice;
  customerName: string;
  previewType: "invoice" | "receipt";
}

export const InvoicePreviewDialog = ({
  isOpen,
  onOpenChange,
  invoice,
  customerName,
  previewType,
}: InvoicePreviewDialogProps) => {
  const { t, i18n } = useTranslation(["invoices"]);
  const [isRTL, setIsRTL] = useState(i18n.language === 'ar');
  const [forceRender, setForceRender] = useState(Date.now());
  const prevOpenRef = useRef(isOpen);
  const prevTypeRef = useRef(previewType);

  useEffect(() => {
    const handleLanguageChange = () => {
      const currentLang = i18n.language;
      const isArabic = currentLang === 'ar';
      setIsRTL(isArabic);
      
      // Update localStorage to ensure PDF components pick it up
      localStorage.setItem('preferredLanguage', isArabic ? 'ar' : 'en');
      console.log(`InvoicePreviewDialog: Setting language to ${isArabic ? 'ar' : 'en'}`);
      
      // Force document direction
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      document.documentElement.lang = currentLang;
      
      // Force re-render of PDF
      setForceRender(Date.now());
    };

    if (isOpen) {
      // Always enforce language settings when dialog opens
      handleLanguageChange();
      
      // Check if dialog just opened or preview type changed
      if (!prevOpenRef.current || prevTypeRef.current !== previewType) {
        prevOpenRef.current = true;
        prevTypeRef.current = previewType;
        setForceRender(Date.now());
      }
    }
    
    // Listen for language changes
    const languageChangeHandler = () => {
      if (isOpen) {
        handleLanguageChange();
      }
    };
    
    i18n.on('languageChanged', languageChangeHandler);
    return () => {
      i18n.off('languageChanged', languageChangeHandler);
    };
  }, [isOpen, i18n, previewType]);

  // Update refs when props change
  useEffect(() => {
    prevOpenRef.current = isOpen;
    prevTypeRef.current = previewType;
  }, [isOpen, previewType]);

  // Handle PDF viewer error and provide fallback
  const handlePDFError = () => {
    console.warn("PDFViewer failed to load, opening in new window");
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>${previewType === "invoice" ? "Invoice" : "Receipt"}</title></head>
          <body>
            <h1>PDF Preview</h1>
            <p>PDF viewer failed to load. Please use the download or print buttons to view the document.</p>
          </body>
        </html>
      `);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-5/6 flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {previewType === "invoice" ? t("invoices:viewInvoice") : t("invoices:viewReceipt")}
          </DialogTitle>
          <DialogDescription>
            {t("invoices:customerName")}: {customerName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full">
            <PDFViewer 
              key={`invoice-viewer-${forceRender}`}
              width="100%" 
              height="100%" 
              className="border rounded"
              showToolbar={true}
            >
              {previewType === "invoice" ? (
                <InvoicePDF 
                  key={`pdf-viewer-invoice-${forceRender}-${isRTL ? 'rtl' : 'ltr'}`}
                  invoice={invoice} 
                  customerName={customerName} 
                />
              ) : (
                <ReceiptPDF 
                  key={`pdf-viewer-receipt-${forceRender}-${isRTL ? 'rtl' : 'ltr'}`}
                  invoice={invoice} 
                  customerName={customerName} 
                />
              )}
            </PDFViewer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
