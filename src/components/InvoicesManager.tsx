
import { useState, useEffect, useCallback } from "react";
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
  const [customers, setCustomers] = useState(storage.getCustomers());
  const [products, setProducts] = useState(storage.getItems());
  const [quotations, setQuotations] = useState(storage.getQuotations());
  const { t, i18n } = useTranslation(["invoices", "common"]);
  const isRTL = i18n.language === 'ar';

  const loadInvoices = useCallback(() => {
    try {
      const loadedInvoices = storage.getInvoices();
      setInvoices(loadedInvoices);
    } catch (error) {
      console.error("Error loading invoices:", error);
      toast.error(t("invoices:loadError"));
    }
  }, [t]);

  const refreshData = useCallback(() => {
    // Refresh all data that might have changed
    setCustomers(storage.getCustomers());
    setProducts(storage.getItems());
    setQuotations(storage.getQuotations());
    loadInvoices();
  }, [loadInvoices]);

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const handleSubmit = (data: Partial<Invoice>) => {
    try {
      const invoiceData: Invoice = {
        id: editingInvoice?.id || crypto.randomUUID(),
        ...data,
        status: editingInvoice?.status || 'draft',
        paymentStatus: editingInvoice?.paymentStatus || 'unpaid',
        createdAt: editingInvoice?.createdAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      } as Invoice;

      if (editingInvoice) {
        storage.updateInvoice(invoiceData);
        toast.success(t("invoices:invoiceUpdated"));
      } else {
        storage.addInvoice(invoiceData);
        toast.success(t("invoices:invoiceCreated"));
      }

      // Update local state after successful operation
      refreshData();
      
      // Close dialog and reset editing state
      setIsDialogOpen(false);
      setEditingInvoice(null);
    } catch (error) {
      console.error("Error submitting invoice:", error);
      toast.error(t("invoices:saveError"));
    }
  };

  const handleEdit = (invoice: Invoice) => {
    try {
      setEditingInvoice(invoice);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error editing invoice:", error);
      toast.error(t("invoices:editError"));
    }
  };

  const handleDelete = (id: string) => {
    try {
      storage.deleteInvoice(id);
      toast.success(t("invoices:invoiceDeleted"));
      // Update the local state after deletion
      refreshData();
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error(t("invoices:deleteError"));
    }
  };

  return (
    <div className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("invoices:title")}</h2>
        <Button onClick={() => {
          setEditingInvoice(null);
          setIsDialogOpen(true);
        }}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("invoices:newInvoice")}
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
        onOpenChange={(open) => {
          if (!open) {
            // Add a small delay to ensure any click events are processed 
            // before state changes which could cause navigation issues
            setTimeout(() => {
              setIsDialogOpen(false);
              setEditingInvoice(null);
            }, 50);
          } else {
            setIsDialogOpen(true);
          }
        }}
        editingInvoice={editingInvoice}
        customers={customers}
        products={products}
        quotations={quotations}
        onSubmit={handleSubmit}
        onCancel={() => {
          setIsDialogOpen(false);
          setEditingInvoice(null);
        }}
      />
    </div>
  );
}
