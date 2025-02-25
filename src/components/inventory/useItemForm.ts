
import { useState } from "react";
import { storage } from "@/lib/storage";
import { InventoryItem, StockMovement } from "@/types/inventory";
import { toast } from "sonner";

export function useItemForm(item?: InventoryItem, onSave?: () => void) {
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

  const handleFieldChange = (field: keyof InventoryItem, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleQuantityChange = (newQuantity: number) => {
    const currentUser = storage.getCurrentUser();
    if (!currentUser) {
      toast.error("Please log in to update quantities");
      return;
    }

    // Ensure we're dealing with numbers for calculation
    const oldQuantity = Number(item?.quantity || 0);
    newQuantity = Number(newQuantity);
    
    // Calculate difference for stock movement
    const difference = newQuantity - oldQuantity;
    
    if (difference !== 0) {
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
      
      console.log("Quantity updated:", {
        oldQuantity,
        newQuantity,
        difference,
        movement
      });
    } else {
      // Even if the value hasn't changed, update the formData to ensure UI consistency
      setFormData({ ...formData, quantity: newQuantity });
    }
  };

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

    // Ensure we're working with the correct data types
    const newItem: InventoryItem = {
      id: item?.id || crypto.randomUUID(),
      name: formData.name!,
      description: formData.description!,
      quantity: Number(formData.quantity!), // Ensure it's a number
      category: formData.category!,
      minQuantity: Number(formData.minQuantity!), // Ensure it's a number
      lastUpdated: new Date().toISOString(),
      cost: Number(formData.cost || 0), // Ensure it's a number
      imageUrl: formData.imageUrl,
      stockMovements: formData.stockMovements || [],
      barcode: formData.barcode,
      qrCode: formData.qrCode,
      supplierId: formData.supplierId,
      lastModifiedBy: currentUser.id
    };

    console.log("Saving item:", newItem);

    if (item) {
      storage.updateItem(newItem);
      toast.success("Item updated successfully");
    } else {
      storage.addItem(newItem);
      toast.success("Item added successfully");
    }
    
    onSave?.();
  };

  return {
    formData,
    handleFieldChange,
    handleQuantityChange,
    handleImageUpload,
    generateBarcode,
    handleSubmit
  };
}
