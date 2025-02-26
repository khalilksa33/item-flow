
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { Invoice } from "@/types/inventory";
import { toast } from "sonner";
import { InvoiceList } from "./invoices/InvoiceList";
import { InvoiceDialog } from "./invoices/InvoiceDialog";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";

export function InvoicesManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [customers] = useState(storage.getCustomers());
  const [products] = useState(storage.getItems());
  const [quotations] = useState(storage.getQuotations());
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    setInvoices(storage.getInvoices());
  };

  const handleSubmit = (data: Partial<Invoice>) => {
    const invoiceData: Invoice = {
      id: editingInvoice?.id || crypto.randomUUID(),
      ...data,
      status: 'draft',
      paymentStatus: 'unpaid',
      createdAt: editingInvoice?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    } as Invoice;

    if (editingInvoice) {
      storage.updateInvoice(invoiceData);
      toast.success(t("invoiceUpdated"));
    } else {
      storage.addInvoice(invoiceData);
      toast.success(t("invoiceCreated"));
    }

    loadInvoices();
    setIsDialogOpen(false);
    setEditingInvoice(null);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteInvoice(id);
    loadInvoices();
    toast.success(t("invoiceDeleted"));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <Button onClick={() => {
          setEditingInvoice(null);
          setIsDialogOpen(true);
        }}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("newInvoice")}
        </Button>
      </div>

      <InvoiceList 
        invoices={invoices} 
        customers={customers} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <InvoiceDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingInvoice={editingInvoice}
        customers={customers}
        products={products}
        quotations={quotations}
        onSubmit={handleSubmit}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
