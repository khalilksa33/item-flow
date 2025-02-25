
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
import { ItemForm } from "./ItemForm";
import { CategoryManager } from "./CategoryManager";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

export function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>();
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    const inventoryItems = storage.getItems();
    setItems(inventoryItems);
    setFilteredItems(inventoryItems);
    checkLowStockItems(inventoryItems);
  };

  const checkLowStockItems = (items: InventoryItem[]) => {
    const lowStockItems = items.filter(item => item.quantity <= item.minQuantity);
    if (lowStockItems.length > 0) {
      toast.warning(t("inventory.lowStockWarning", { count: lowStockItems.length }), {
        description: t("inventory.checkLevels")
      });
    }
  };

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
    toast.success(t("inventory.exportSuccess"));
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
            loadItems();
            toast.success(t("inventory.importSuccess"));
          } else {
            toast.error(t("inventory.importError"));
          }
        } catch (error) {
          toast.error(t("inventory.importFormatError"));
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const checkAppActivation = () => {
      if (!storage.checkActivation()) {
        toast.error(t("inventory.licenseExpired"));
      }
    };

    checkAppActivation();
    const interval = setInterval(checkAppActivation, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, [t]);

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsItemFormOpen(true);
  };

  const handleDetailView = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsDetailViewOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {!storage.checkActivation() && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">{t("inventory.licenseExpired")}</strong>
          <span className="block sm:inline"> {t("inventory.licenseMessage")}</span>
        </div>
      )}
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold">{t("inventory.title")}</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsCategoryManagerOpen(true)}>
            <Tags className="h-4 w-4 mr-2" />
            {t("inventory.categories")}
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t("inventory.export")}
          </Button>
          <Button onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            {t("inventory.import")}
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <Button onClick={() => setIsItemFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("inventory.addItem")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            {t("inventory.itemsList")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("inventory.searchItems")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("inventory.name")}</TableHead>
                <TableHead>{t("inventory.category")}</TableHead>
                <TableHead>{t("common.description")}</TableHead>
                <TableHead>{t("inventory.quantity")}</TableHead>
                <TableHead>{t("inventory.minQuantity")}</TableHead>
                <TableHead>{t("inventory.price")}</TableHead>
                <TableHead>{t("inventory.lastUpdated")}</TableHead>
                <TableHead>{t("inventory.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow 
                  key={item.id}
                  className={item.quantity <= item.minQuantity ? "bg-red-50" : ""}
                >
                  <TableCell className="font-medium">
                    <button 
                      onClick={() => handleDetailView(item)}
                      className="hover:underline"
                    >
                      {item.name}
                    </button>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {item.quantity}
                    {item.quantity <= item.minQuantity && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{item.minQuantity}</TableCell>
                  <TableCell>
                    ${item.cost ? item.cost.toFixed(2) : '0.00'}
                  </TableCell>
                  <TableCell>
                    {new Date(item.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      {t("common.edit")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ItemForm
        isOpen={isItemFormOpen}
        onClose={() => {
          setIsItemFormOpen(false);
          setSelectedItem(undefined);
        }}
        item={selectedItem}
        onSave={loadItems}
      />

      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
      />

      {selectedItem && (
        <Dialog 
          open={isDetailViewOpen} 
          onOpenChange={() => setIsDetailViewOpen(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedItem.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">{t("common.description")}</h4>
                <p>{selectedItem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">{t("inventory.category")}</h4>
                  <p>{selectedItem.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold">{t("inventory.currentStock")}</h4>
                  <p className={selectedItem.quantity <= selectedItem.minQuantity ? "text-red-500" : ""}>
                    {selectedItem.quantity}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">{t("inventory.minimumStock")}</h4>
                  <p>{selectedItem.minQuantity}</p>
                </div>
                <div>
                  <h4 className="font-semibold">{t("inventory.price")}</h4>
                  <p>${selectedItem.cost ? selectedItem.cost.toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <h4 className="font-semibold">{t("inventory.lastUpdated")}</h4>
                  <p>{new Date(selectedItem.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="text-sm text-muted-foreground">
        <h2 className="font-semibold mb-2">{t("inventory.quickTips")}</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>{t("inventory.tipClickName")}</li>
          <li>{t("inventory.tipSearch")}</li>
          <li>{t("inventory.tipLowStock")}</li>
          <li>{t("inventory.tipExport")}</li>
          <li>{t("inventory.tipCategories")}</li>
        </ul>
      </div>
    </div>
  );
}
