
import { InventoryItem } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { InventoryListHeader } from "./inventory/InventoryListHeader";
import { InventoryTable } from "./inventory/InventoryTable";
import { useInventoryList } from "./inventory/useInventoryList";
import { useRef } from "react";

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryList({ items, onEdit, onDelete }: InventoryListProps) {
  const { t } = useTranslation(["inventory"]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchTerm,
    setSearchTerm,
    filteredItems,
    handleExport,
    handleImport
  } = useInventoryList(items);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5" />
          {t("inventory:itemsList")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <InventoryListHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onExport={handleExport}
          onImportClick={handleImportClick}
        />
        
        <InventoryTable
          items={filteredItems}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        
        <input
          ref={fileInputRef}
          id="import-file"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleImport}
        />
      </CardContent>
    </Card>
  );
}
