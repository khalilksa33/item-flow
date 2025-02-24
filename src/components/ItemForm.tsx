
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { InventoryItem } from "@/types/inventory";
import { SupplierManager } from "./SupplierManager";
import { ItemFormFields } from "./inventory/ItemFormFields";
import { useItemForm } from "./inventory/useItemForm";

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InventoryItem;
  onSave: () => void;
}

export function ItemForm({ isOpen, onClose, item, onSave }: ItemFormProps) {
  const [isSupplierManagerOpen, setIsSupplierManagerOpen] = useState(false);
  
  const {
    formData,
    handleFieldChange,
    handleQuantityChange,
    handleImageUpload,
    generateBarcode,
    handleSubmit
  } = useItemForm(item, onSave);

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <ItemFormFields
              formData={formData}
              onFieldChange={handleFieldChange}
              onQuantityChange={handleQuantityChange}
              onGenerateBarcode={generateBarcode}
              onSupplierManage={() => setIsSupplierManagerOpen(true)}
              onImageUpload={handleImageUpload}
            />
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
