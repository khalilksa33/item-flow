
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { storage } from "@/lib/storage";
import { InventoryItem } from "@/types/inventory";

interface ItemFormFieldsProps {
  formData: Partial<InventoryItem>;
  onFieldChange: (field: keyof InventoryItem, value: any) => void;
  onQuantityChange: (value: number) => void;
  onGenerateBarcode: () => void;
  onSupplierManage: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ItemFormFields({
  formData,
  onFieldChange,
  onQuantityChange,
  onGenerateBarcode,
  onSupplierManage,
  onImageUpload
}: ItemFormFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => onFieldChange('description', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          value={formData.category}
          onChange={(e) => onFieldChange('category', e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {storage.getCategories().map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minQuantity">Minimum Quantity</Label>
          <Input
            id="minQuantity"
            type="number"
            min="0"
            value={formData.minQuantity}
            onChange={(e) => onFieldChange('minQuantity', Number(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cost">Cost per Unit ($)</Label>
        <Input
          id="cost"
          type="number"
          min="0"
          step="0.01"
          value={formData.cost}
          onChange={(e) => onFieldChange('cost', Number(e.target.value))}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supplier">Supplier</Label>
        <div className="flex gap-2">
          <select
            id="supplier"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2"
            value={formData.supplierId}
            onChange={(e) => onFieldChange('supplierId', e.target.value)}
          >
            <option value="">Select a supplier</option>
            {storage.getSuppliers().map((supplier) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="outline"
            onClick={onSupplierManage}
          >
            Manage
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="barcode">Barcode</Label>
        <div className="flex gap-2">
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => onFieldChange('barcode', e.target.value)}
            placeholder="Barcode number"
          />
          <Button type="button" onClick={onGenerateBarcode}>
            Generate
          </Button>
        </div>
      </div>

      {formData.qrCode && (
        <div className="space-y-2">
          <Label>QR Code</Label>
          <div className="flex justify-center">
            <img
              src={formData.qrCode}
              alt="QR Code"
              className="w-32 h-32"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="image">Item Image</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={onImageUpload}
        />
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="Item preview"
              className="max-h-32 rounded-md"
            />
          </div>
        )}
      </div>
    </>
  );
}
