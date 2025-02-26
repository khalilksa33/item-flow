
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

interface InventoryListHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onImportClick: () => void;
}

export function InventoryListHeader({
  searchTerm,
  onSearchChange,
  onExport,
  onImportClick
}: InventoryListHeaderProps) {
  const { t, i18n } = useTranslation(["inventory"]);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("inventory:searchItems")}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          {t("inventory:export")}
        </Button>
        <Button variant="outline" onClick={onImportClick}>
          <Upload className="h-4 w-4 mr-2" />
          {t("inventory:import")}
        </Button>
      </div>
    </div>
  );
}
