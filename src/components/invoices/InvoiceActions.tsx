
import { useState } from "react";
import { Invoice, Customer } from "@/types/inventory";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilePenLine, MoreHorizontal, Trash, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InvoiceDownloadActions } from "./actions/InvoiceDownloadActions";
import { InvoicePrintActions } from "./actions/InvoicePrintActions";
import { InvoicePreviewDialog } from "./actions/InvoicePreviewDialog";

interface InvoiceActionsProps {
  invoice: Invoice;
  customers: Customer[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
}

export function InvoiceActions({ invoice, customers, onEdit, onDelete }: InvoiceActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [previewType, setPreviewType] = useState<"invoice" | "receipt">("invoice");
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';

  const customerName = customers.find(c => c.id === invoice.customerId)?.name || t("invoices:unknownCustomer");

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(t("common:confirmDelete"))) {
      onDelete(invoice.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(invoice);
  };

  const handleViewInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Force set language in localStorage before viewing
    localStorage.setItem('preferredLanguage', i18n.language);
    setPreviewType("invoice");
    setIsViewOpen(true);
  };

  const handleViewReceipt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Force set language in localStorage before viewing
    localStorage.setItem('preferredLanguage', i18n.language);
    setPreviewType("receipt");
    setIsViewOpen(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? "start" : "end"}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <DropdownMenuItem onClick={handleEdit}>
            <FilePenLine className="mr-2 h-4 w-4" />
            {t("common:edit")}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleViewInvoice}>
            <Eye className="mr-2 h-4 w-4" />
            {t("invoices:viewInvoice")}
          </DropdownMenuItem>
          
          {invoice.status === 'paid' && (
            <DropdownMenuItem onClick={handleViewReceipt}>
              <Eye className="mr-2 h-4 w-4" />
              {t("invoices:viewReceipt")}
            </DropdownMenuItem>
          )}
          
          <InvoicePrintActions 
            invoice={invoice} 
            customerName={customerName} 
          />
          
          <InvoiceDownloadActions 
            invoice={invoice} 
            customerName={customerName} 
          />
          
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            {t("common:delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InvoicePreviewDialog 
        isOpen={isViewOpen}
        onOpenChange={setIsViewOpen}
        invoice={invoice}
        customerName={customerName}
        previewType={previewType}
      />
    </>
  );
}
