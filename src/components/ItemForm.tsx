
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
  });

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
    if (item) {
      const difference = newQuantity - (item.quantity || 0);
      const movement: StockMovement = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        quantity: Math.abs(difference),
        type: difference > 0 ? 'in' : 'out',
        reason: 'Manual adjustment',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
  );
}
