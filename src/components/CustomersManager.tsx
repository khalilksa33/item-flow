
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { Customer } from "@/types/inventory";
import { toast } from "sonner";
import { CustomerForm } from "./customers/CustomerForm";
import { CustomerList } from "./customers/CustomerList";
import { useTranslation } from "react-i18next";

export function CustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>(storage.getCustomers());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { t } = useTranslation();

  const loadCustomers = () => {
    setCustomers(storage.getCustomers());
  };

  const handleSubmit = (formData: Omit<Customer, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const customerData: Customer = {
      id: editingCustomer?.id || crypto.randomUUID(),
      ...formData,
      createdAt: editingCustomer?.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    if (editingCustomer) {
      storage.updateCustomer(customerData);
      toast.success(t("customers.customerUpdated"));
    } else {
      storage.addCustomer(customerData);
      toast.success(t("customers.customerAdded"));
    }

    loadCustomers();
    setIsDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteCustomer(id);
    loadCustomers();
    toast.success(t("customers.customerDeleted"));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("customers.title")}</h2>
        <Button onClick={() => {
          setEditingCustomer(null);
          setIsDialogOpen(true);
        }}>
          {t("customers.addCustomer")}
        </Button>
      </div>

      <CustomerList
        customers={customers}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? t("customers.editCustomer") : t("customers.addNewCustomer")}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto pr-1">
            <CustomerForm
              editingCustomer={editingCustomer}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
