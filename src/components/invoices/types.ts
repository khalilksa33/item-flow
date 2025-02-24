
import { Invoice, InvoiceItem, Customer, InventoryItem, Quotation } from "@/types/inventory";

export interface InvoiceItemProps {
  item: InvoiceItem;
  products: any[];
  onItemChange: (field: keyof InvoiceItem, value: any) => void;
  onRemove: () => void;
}

export interface InvoiceFormProps {
  editingInvoice: Invoice | null;
  customers: Customer[];
  products: InventoryItem[];
  quotations: Quotation[];
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
}
