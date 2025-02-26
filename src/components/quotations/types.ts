
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

export interface QuotationActionsProps {
  quotation: Quotation;
  customerName: string;
  onEdit: (quotation: Quotation) => void;
  onDelete: (id: string) => void;
}

export interface QuotationStatusBadgeProps {
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
}

export interface QuotationTableProps {
  quotations: Quotation[];
  customers: any[];
  onEdit: (quotation: Quotation) => void;
  onDelete: (id: string) => void;
}
