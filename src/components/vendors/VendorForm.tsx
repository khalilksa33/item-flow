
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export function VendorForm({
  formData,
  editingVendor,
  onChange,
  onSubmit,
  onCancel,
}: VendorFormProps) {
  const { t } = useTranslation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let updatedValue: any = value;

    if (type === 'number') {
      updatedValue = parseFloat(value);
    } else if (type === 'checkbox') {
      updatedValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'products') {
      // Split the comma-separated string into an array of products
      updatedValue = value.split(',').map(p => p.trim()).filter(p => p !== '');
    }

    onChange({ ...formData, [name]: updatedValue });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("vendors.name")}</Label>
          <Input
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">{t("vendors.type")}</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
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
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("vendors.phone")}</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">{t("vendors.address")}</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address || ''}
          onChange={handleInputChange}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="taxId">{t("vendors.taxId")}</Label>
          <Input
            id="taxId"
            name="taxId"
            value={formData.taxId || ''}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">{t("vendors.paymentTerms")}</Label>
          <Input
            id="paymentTerms"
            name="paymentTerms"
            value={formData.paymentTerms || ''}
            onChange={handleInputChange}
            placeholder={t("vendors.paymentTermsPlaceholder")}
          />
        </div>
      </div>

      {/* Products and Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="products">{t("vendors.products")}</Label>
          <Input
            id="products"
            name="products"
            value={formData.products ? formData.products.join(', ') : ''}
            onChange={handleInputChange}
            placeholder={t("vendors.productsPlaceholder")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">{t("vendors.rating")}</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating || 0}
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* Contract Status */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            id="activeContract"
            name="activeContract"
            type="checkbox"
            checked={formData.activeContract || false}
            onChange={handleInputChange}
            className="h-4 w-4 rounded border-gray-300"
          />
          <Label htmlFor="activeContract">{t("vendors.activeContract")}</Label>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">{t("vendors.notes")}</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleInputChange}
          rows={4}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
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
