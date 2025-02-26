
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Customer, Invoice, InventoryItem, Quotation } from "@/types/inventory";
import { InvoiceForm } from "./InvoiceForm";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface InvoiceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingInvoice: Invoice | null;
  customers: Customer[];
  products: InventoryItem[];
  quotations: Quotation[];
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
}

export function InvoiceDialog({
  isOpen,
  onOpenChange,
  editingInvoice,
  customers,
  products,
  quotations,
  onSubmit,
  onCancel,
}: InvoiceDialogProps) {
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';

  const handleFormSubmit = (data: Partial<Invoice>) => {
    try {
      // Prevent dialog from closing before form submission is complete
      onSubmit(data);
    } catch (error) {
      console.error("Error submitting invoice form:", error);
      toast.error(t("invoices:submitError", "Error submitting invoice"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-4xl" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle className={isRTL ? "text-right" : "text-left"}>
            {editingInvoice ? t("invoices:editInvoice") : t("invoices:createInvoice")}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto">
          <InvoiceForm
            editingInvoice={editingInvoice}
            customers={customers}
            products={products}
            quotations={quotations}
            onSubmit={handleFormSubmit}
            onCancel={onCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
