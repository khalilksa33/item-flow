
import { toast } from "sonner";
import { Invoice } from "@/types/inventory";

/**
 * Opens a new window and handles printing of invoice or receipt
 */
export const printDocument = (
  invoice: Invoice, 
  customerName: string, 
  type: "invoice" | "receipt", 
  isRTL: boolean,
  translateFunction: (key: string) => string
) => {
  try {
    // Force set language in localStorage before printing to ensure proper rendering
    const languageToUse = isRTL ? 'ar' : 'en';
    localStorage.setItem('preferredLanguage', languageToUse);
    
    // Open a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      toast.error(translateFunction("invoices:popupBlocked"));
      return;
    }
    
    // Write the necessary HTML to the new window with explicit RTL/LTR direction
    printWindow.document.write(`
      <html dir="${isRTL ? 'rtl' : 'ltr'}" lang="${isRTL ? 'ar' : 'en'}">
        <head>
          <title>${type === "invoice" ? translateFunction("invoices:printInvoice") : translateFunction("invoices:printReceipt")}</title>
          <meta charset="UTF-8">
          <style>
            body { margin: 0; direction: ${isRTL ? 'rtl' : 'ltr'}; }
            iframe { width: 100%; height: 100vh; border: none; }
          </style>
        </head>
        <body>
          <div id="pdf-container"></div>
          <script>
            // Notify that the window is ready to receive the PDF
            window.onload = function() {
              window.opener.postMessage('readyForPDF', '*');
            };
          </script>
        </body>
      </html>
    `);
    
    // Listen for the window's ready message
    const messageListener = (event: MessageEvent) => {
      if (event.data === 'readyForPDF') {
        // Remove the listener to avoid duplicates
        window.removeEventListener('message', messageListener);
        
        // Create a local URL for embedding in the new window with language parameter
        const blob = new Blob([
          `<iframe src="/invoices/${invoice.id}/${type}?lang=${isRTL ? 'ar' : 'en'}" width="100%" height="100%" frameborder="0"></iframe>`
        ], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Replace the content with an iframe that loads the PDF
        printWindow.document.getElementById('pdf-container')!.innerHTML = `
          <iframe src="${blobUrl}" onload="setTimeout(function() { window.print(); }, 1500);"></iframe>
        `;
      }
    };
    
    window.addEventListener('message', messageListener);
  } catch (error) {
    console.error("Print error:", error);
    toast.error(translateFunction("common:errorOccurred"));
  }
};
