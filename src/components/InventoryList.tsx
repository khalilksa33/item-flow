
import { useState, useEffect } from "react";
import { InventoryItem } from "@/types/inventory";
import { storage } from "@/lib/storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package2, Plus, Search, Tags, Download, Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface InventoryListProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export function InventoryList({ items, onEdit, onDelete }: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(items);
  const { t, i18n } = useTranslation(["inventory", "common"]);
  const isRTL = i18n.language === 'ar';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="h-5 w-5" />
          {t("inventory:itemsList")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("inventory:searchItems")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              {t("inventory:export")}
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              {t("inventory:import")}
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:name")}</TableHead>
              <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:category")}</TableHead>
              <TableHead className={isRTL ? "text-right" : ""}>{t("common:description")}</TableHead>
              <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:quantity")}</TableHead>
              <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:minQuantity")}</TableHead>
              <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:price")}</TableHead>
              <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:lastUpdated")}</TableHead>
              <TableHead className={isRTL ? "text-right" : ""}>{t("inventory:actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow 
                key={item.id}
                className={item.quantity <= item.minQuantity ? "bg-red-50" : ""}
              >
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {item.quantity}
                  {item.quantity <= item.minQuantity && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </TableCell>
                <TableCell>{item.minQuantity}</TableCell>
                <TableCell>${item.cost?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{new Date(item.lastUpdated).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(item)}
                    >
                      {t("common:edit")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      {t("common:delete")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
