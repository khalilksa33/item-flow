
import { Invoice, InvoiceItem } from "@/types/inventory";

export interface InvoiceItemProps {
  item: InvoiceItem;
  products: any[];
  onItemChange: (field: keyof InvoiceItem, value: any) => void;
  onRemove: () => void;
}

export interface InvoiceFormProps {
  editingInvoice: Invoice | null;
  customers: any[];
  products: any[];
  quotations: any[];
  onSubmit: (data: Partial<Invoice>) => void;
  onCancel: () => void;
}
