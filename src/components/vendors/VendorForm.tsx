
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Vendor } from "@/types/inventory";

interface VendorFormData extends Omit<Vendor, 'id'> {}

interface VendorFormProps {
  formData: VendorFormData;
  editingVendor: Vendor | null;
  onChange: (data: VendorFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function VendorForm({ formData, editingVendor, onChange, onSubmit, onCancel }: VendorFormProps) {
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            className="w-full rounded-md border border-input bg-background px-3 py-2"
            value={formData.type}
            onChange={handleTypeChange}
            required
          >
            <option value="manufacturer">Manufacturer</option>
            <option value="wholesaler">Wholesaler</option>
            <option value="distributor">Distributor</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input
            id="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Input
            id="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleInputChange}
            required
            placeholder="e.g., Net 30"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="products">Products (comma-separated)</Label>
          <Input
            id="products"
            value={formData.products.join(', ')}
            onChange={(e) => handleProductsChange(e.target.value)}
            placeholder="e.g., Electronics, Components, Accessories"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
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
            Active Contract
          </Label>
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Input
            id="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editingVendor ? "Update" : "Add"} Vendor
        </Button>
      </div>
    </form>
  );
}
