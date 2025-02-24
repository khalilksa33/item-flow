
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/lib/storage";
import { InventoryItem, StockMovement } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SupplierManager } from "./SupplierManager";

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InventoryItem;
  onSave: () => void;
}

export function ItemForm({ isOpen, onClose, item, onSave }: ItemFormProps) {
  const [formData, setFormData] = useState<Partial<InventoryItem>>({
    name: item?.name || "",
    description: item?.description || "",
    quantity: item?.quantity || 0,
    category: item?.category || "",
    minQuantity: item?.minQuantity || 0,
    cost: item?.cost || 0,
    imageUrl: item?.imageUrl || "",
    stockMovements: item?.stockMovements || [],
    barcode: item?.barcode || "",
    qrCode: item?.qrCode || "",
    supplierId: item?.supplierId || ""
  });
  const [isSupplierManagerOpen, setIsSupplierManagerOpen] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      toast.error("Please log in to update quantities");
      return;
    }

    if (item) {
      const difference = newQuantity - (item.quantity || 0);
      const movement: StockMovement = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        quantity: Math.abs(difference),
        type: difference > 0 ? 'in' : 'out',
        reason: 'Manual adjustment',
        userId: currentUser.id
      };

      setFormData({
        ...formData,
        quantity: newQuantity,
        stockMovements: [...(formData.stockMovements || []), movement],
      });
    } else {
      setFormData({ ...formData, quantity: newQuantity });
    }
  };

  const generateBarcode = () => {
    const barcodeValue = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${barcodeValue}`;
    setFormData({
      ...formData,
      barcode: barcodeValue,
      qrCode: qrCodeUrl
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      toast.error("Please log in to save items");
      return;
    }

    const newItem: InventoryItem = {
      id: item?.id || crypto.randomUUID(),
      name: formData.name!,
      description: formData.description!,
      quantity: formData.quantity!,
      category: formData.category!,
      minQuantity: formData.minQuantity!,
      lastUpdated: new Date().toISOString(),
      cost: formData.cost,
      imageUrl: formData.imageUrl,
      stockMovements: formData.stockMovements || [],
      barcode: formData.barcode,
      qrCode: formData.qrCode,
      supplierId: formData.supplierId,
      lastModifiedBy: currentUser.id
    };

    if (item) {
      storage.updateItem(newItem);
      toast.success("Item updated successfully");
    } else {
      storage.addItem(newItem);
      toast.success("Item added successfully");
    }
    
    onSave();
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
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
                  onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
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
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
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
                  onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
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
                  onClick={() => setIsSupplierManagerOpen(true)}
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
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="Barcode number"
                />
                <Button type="button" onClick={generateBarcode}>
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
                onChange={handleImageUpload}
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{item ? "Update" : "Add"} Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <SupplierManager
        isOpen={isSupplierManagerOpen}
        onClose={() => setIsSupplierManagerOpen(false)}
      />
    </>
  );
}
