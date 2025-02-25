
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemForm } from "@/components/ItemForm";
import { InventoryList } from "@/components/InventoryList";
import { storage } from "@/lib/storage";
import { InventoryItem } from "@/types/inventory";
import { toast } from "sonner";

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>(storage.getItems());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const loadItems = () => {
    setItems(storage.getItems());
  };

  const handleSubmit = (formData: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const itemData: InventoryItem = {
      id: editingItem?.id || crypto.randomUUID(),
      ...formData,
      lastUpdated: new Date().toISOString(),
      stockMovements: formData.stockMovements || []
    };

    if (editingItem) {
      storage.updateItem(itemData);
      toast.success("Item updated successfully");
    } else {
      storage.addItem(itemData);
      toast.success("Item added successfully");
    }

    loadItems();
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteItem(id);
    loadItems();
    toast.success("Item deleted successfully");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button onClick={() => {
          setEditingItem(null);
          setIsDialogOpen(true);
        }}>
          Add Item
        </Button>
      </div>

      <div className="space-y-4">
        <InventoryList
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Item" : "Add New Item"}
            </DialogTitle>
          </DialogHeader>
          <ItemForm
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            item={editingItem}
            onSave={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InventoryPage;
