
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
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

  const handleExport = () => {
    const csv = storage.exportToCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("inventory:exportSuccess"));
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target?.result as string;
          const success = storage.importFromCSV(csvContent);
          if (success) {
            toast.success(t("inventory:importSuccess"));
          } else {
            toast.error(t("inventory:importError"));
          }
        } catch (error) {
          toast.error(t("inventory:importFormatError"));
        }
      };
      reader.readAsText(file);
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
