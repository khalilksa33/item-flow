
import { Invoice, Customer, InventoryItem, Quotation } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvoiceForm } from "./InvoiceForm";

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingInvoice ? "Edit Invoice" : "New Invoice"}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto pr-1">
          <InvoiceForm
            editingInvoice={editingInvoice}
            customers={customers}
            products={products}
            quotations={quotations}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
