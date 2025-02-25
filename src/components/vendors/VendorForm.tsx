
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vendor } from "@/types/inventory";
import { useTranslation } from "react-i18next";

interface VendorFormData extends Omit<Vendor, 'id'> {}

interface VendorFormProps {
  formData: VendorFormData;
  editingVendor: Vendor | null;
  onChange: (data: VendorFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function VendorForm({ formData, editingVendor, onChange, onSubmit, onCancel }: VendorFormProps) {
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    onChange({ ...formData, [id]: value });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...formData, type: e.target.value as 'manufacturer' | 'wholesaler' | 'distributor' });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...formData, activeContract: e.target.checked });
  };

  const handleProductsChange = (value: string) => {
    const productsList = value.split(',').map(p => p.trim()).filter(p => p);
    onChange({ ...formData, products: productsList });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("vendors.name")}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">{t("vendors.type")}</Label>
          <select
            id="type"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.type}
            onChange={handleTypeChange}
            required
          >
            <option value="manufacturer">{t("vendors.manufacturer")}</option>
            <option value="wholesaler">{t("vendors.wholesaler")}</option>
            <option value="distributor">{t("vendors.distributor")}</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("vendors.email")}</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("vendors.phone")}</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="address">{t("vendors.address")}</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">{t("vendors.taxId")}</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">{t("vendors.paymentTerms")}</Label>
          <Input
            id="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleInputChange}
            required
            placeholder={t("vendors.paymentTermsPlaceholder")}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="products">{t("vendors.productsList")}</Label>
          <Input
            id="products"
            value={formData.products.join(', ')}
            onChange={(e) => handleProductsChange(e.target.value)}
            placeholder={t("vendors.productsPlaceholder")}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">{t("vendors.rating")}</Label>
          <Input
            id="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => onChange({ ...formData, rating: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.activeContract}
              onChange={handleCheckboxChange}
              className="rounded border-gray-300"
            />
            {t("vendors.activeContract")}
          </Label>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="notes">{t("vendors.notes")}</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("vendors.cancel")}
        </Button>
        <Button type="submit">
          {editingVendor ? t("vendors.update") : t("vendors.add")}
        </Button>
      </div>
    </form>
  );
}
