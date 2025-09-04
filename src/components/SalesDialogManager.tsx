import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sale, Customer } from "@/types/inventory";
import { useTranslation } from "react-i18next";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

interface SaleDialogManagerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingSale: Sale | null;
  customers: Customer[];
  onSaveComplete: () => void;
}

export function SaleDialogManager({
  isOpen,
  onOpenChange,
  editingSale,
  customers,
  onSaveComplete
}: SaleDialogManagerProps) {
  const { t, i18n } = useTranslation(["sales", "common"]);
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    customerId: editingSale?.customerId || "",
    total: editingSale?.total?.toString() || "",
    status: editingSale?.status || "pending",
    paymentStatus: editingSale?.paymentStatus || "unpaid",
    date: editingSale?.date || new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saleData: Sale = {
      id: editingSale?.id || crypto.randomUUID(),
      customerId: formData.customerId,
      items: editingSale?.items || [], // Keep existing items or empty array
      total: parseFloat(formData.total),
      status: formData.status as 'pending' | 'completed' | 'cancelled',
      paymentStatus: formData.paymentStatus as 'paid' | 'unpaid' | 'partial',
      date: formData.date
    };

    try {
      if (editingSale) {
        storage.updateSale(saleData);
        toast.success(t("sales:updateSuccess", "Sale updated successfully"));
      } else {
        storage.addSale(saleData);
        toast.success(t("sales:createSuccess", "Sale created successfully"));
      }
      
      onSaveComplete();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        customerId: "",
        total: "",
        status: "pending",
        paymentStatus: "unpaid",
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error("Error saving sale:", error);
      toast.error(t("common:error"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {editingSale ? t("sales:editSale", "Edit Sale") : t("sales:newSale", "New Sale")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer">{t("sales:customer", "Customer")}</Label>
            <Select
              value={formData.customerId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("sales:selectCustomer", "Select Customer")} />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="total">{t("sales:total", "Total")}</Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              value={formData.total}
              onChange={(e) => setFormData(prev => ({ ...prev, total: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="date">{t("sales:date", "Date")}</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">{t("sales:status", "Status")}</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'pending' | 'completed' | 'cancelled') => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{t("sales:pending", "Pending")}</SelectItem>
                <SelectItem value="completed">{t("sales:completed", "Completed")}</SelectItem>
                <SelectItem value="cancelled">{t("sales:cancelled", "Cancelled")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentStatus">{t("sales:paymentStatus", "Payment Status")}</Label>
            <Select
              value={formData.paymentStatus}
              onValueChange={(value: 'paid' | 'unpaid' | 'partial') => setFormData(prev => ({ ...prev, paymentStatus: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">{t("sales:paid", "Paid")}</SelectItem>
                <SelectItem value="unpaid">{t("sales:unpaid", "Unpaid")}</SelectItem>
                <SelectItem value="partial">{t("sales:partial", "Partial")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={`flex justify-${isRTL ? "start" : "end"} gap-2 pt-4`}>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common:cancel")}
            </Button>
            <Button type="submit">
              {editingSale ? t("common:update") : t("common:create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}