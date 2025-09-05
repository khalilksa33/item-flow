
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { pdf } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/documents/InvoicePDF";
import { ReceiptPDF } from "@/components/documents/ReceiptPDF";
import { Invoice } from "@/types/inventory";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";

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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  // Generate PDF blob for preview
  const generatePdfBlob = async () => {
    try {
      setIsLoading(true);
      const pdfComponent = previewType === "invoice" ? (
        <InvoicePDF invoice={invoice} customerName={customerName} />
      ) : (
        <ReceiptPDF invoice={invoice} customerName={customerName} />
      );
      
      const blob = await pdf(pdfComponent).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error(t("invoices:errorGeneratingPreview"));
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF when dialog opens or type changes
  useEffect(() => {
    if (isOpen) {
      generatePdfBlob();
    } else {
      // Clean up blob URL when dialog closes
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
    }
  }, [isOpen, previewType, forceRender]);

  // Download PDF
  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${previewType}-${invoice.id}.pdf`;
      link.click();
    }
  };

  // Print PDF
  const handlePrint = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl);
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      } else {
        toast.error(t("invoices:popupBlocked"));
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-5/6 flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {previewType === "invoice" ? t("invoices:viewInvoice") : t("invoices:viewReceipt")}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!pdfUrl || isLoading}
              >
                <Download className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("common:download")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={!pdfUrl || isLoading}
              >
                <Printer className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t("common:print")}
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            {t("invoices:customerName")}: {customerName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">{t("common:loading")}...</p>
              </div>
            ) : pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border rounded"
                title={`${previewType} preview`}
              />
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {t("invoices:failedToLoadPreview")}
                </p>
                <Button onClick={generatePdfBlob}>
                  {t("invoices:retryPreview")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
