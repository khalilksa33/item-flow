
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/inventory";
import { useTranslation } from "react-i18next";

interface CustomerFormProps {
  editingCustomer: Customer | null;
  onSubmit: (data: Omit<Customer, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

export function CustomerForm({ editingCustomer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt' | 'lastUpdated'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'individual',
  });
  
  const { t, i18n } = useTranslation(["customers", "common"]);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        address: editingCustomer.address,
        type: editingCustomer.type,
        taxId: editingCustomer.taxId,
        creditLimit: editingCustomer.creditLimit,
        paymentTerms: editingCustomer.paymentTerms,
        notes: editingCustomer.notes,
      });
    }
  }, [editingCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="space-y-2">
        <Label htmlFor="name" className={isRTL ? "text-right block" : "text-left block"}>
          {t("customers:name")}
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className={isRTL ? "text-right" : "text-left"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className={isRTL ? "text-right block" : "text-left block"}>
          {t("customers:type")}
        </Label>
        <select
          id="type"
          className={`w-full rounded-md border border-input bg-background px-3 py-2 ${isRTL ? "text-right" : "text-left"}`}
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'individual' | 'business' })}
          required
        >
          <option value="individual">{t("customers:individual")}</option>
          <option value="business">{t("customers:business")}</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className={isRTL ? "text-right block" : "text-left block"}>
          {t("customers:email")}
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className={isRTL ? "text-right" : "text-left"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className={isRTL ? "text-right block" : "text-left block"}>
          {t("customers:phone")}
        </Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className={isRTL ? "text-right" : "text-left"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className={isRTL ? "text-right block" : "text-left block"}>
          {t("customers:address")}
        </Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          className={isRTL ? "text-right" : "text-left"}
        />
      </div>

      {formData.type === 'business' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="taxId" className={isRTL ? "text-right block" : "text-left block"}>
              {t("customers:taxId")}
            </Label>
            <Input
              id="taxId"
              value={formData.taxId || ''}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              className={isRTL ? "text-right" : "text-left"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit" className={isRTL ? "text-right block" : "text-left block"}>
              {t("customers:creditLimit")}
            </Label>
            <Input
              id="creditLimit"
              type="number"
              value={formData.creditLimit || ''}
              onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
              className={isRTL ? "text-right" : "text-left"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms" className={isRTL ? "text-right block" : "text-left block"}>
              {t("customers:paymentTerms")}
            </Label>
            <Input
              id="paymentTerms"
              value={formData.paymentTerms || ''}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              className={isRTL ? "text-right" : "text-left"}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes" className={isRTL ? "text-right block" : "text-left block"}>
          {t("customers:notes")}
        </Label>
        <Input
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className={isRTL ? "text-right" : "text-left"}
        />
      </div>

      <div className={`flex justify-${isRTL ? "start" : "end"} gap-2`}>
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common:cancel")}
        </Button>
        <Button type="submit">
          {editingCustomer ? t("common:update") : t("common:save")}
        </Button>
      </div>
    </form>
  );
}
