
import { Quotation, QuotationItem } from "@/types/inventory";

export interface QuotationItemProps {
  item: QuotationItem;
  products: any[];
  onItemChange: (field: keyof QuotationItem, value: any) => void;
  onRemove: () => void;
}

export interface QuotationFormProps {
  editingQuotation: Quotation | null;
  customers: any[];
  products: any[];
  onSubmit: (data: Partial<Quotation>) => void;
  onCancel: () => void;
}
