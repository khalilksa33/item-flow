
import { useState, useEffect } from "react";
import { InventoryItem } from "@/types/inventory";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function useInventoryList(items: InventoryItem[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(items);
  const { t } = useTranslation(["inventory"]);

  useEffect(() => {
    const filtered = items.filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const handleExport = () => {
    storage.exportToCSV(items);
    toast.success(t("inventory:exportSuccess"));
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      storage.importFromCSV(file)
        .then((importedItems: any) => {
          if (importedItems && Array.isArray(importedItems)) {
            importedItems.forEach(item => storage.addInventoryItem(item));
            toast.success(t("inventory:importSuccess"));
          } else {
            toast.error(t("inventory:importError"));
          }
        })
        .catch(() => {
          toast.error(t("inventory:importFormatError"));
        });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    handleExport,
    handleImport
  };
}
