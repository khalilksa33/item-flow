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

export function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [isItemFormOpen, setIsItemFormOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | undefined>();
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);

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
      toast.warning(`${lowStockItems.length} items are low in stock!`, {
        description: "Check your inventory levels"
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
    toast.success("Inventory data exported successfully as CSV");
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
            toast.success("Inventory data imported successfully from CSV");
          } else {
            toast.error("Error importing data. Please check the CSV format.");
          }
        } catch (error) {
          toast.error("Error importing data. Please check the file format.");
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const checkAppActivation = () => {
      if (!storage.checkActivation()) {
        toast.error("Your application license has expired. Please renew to continue using the system.");
      }
    };

    checkAppActivation();
    const interval = setInterval(checkAppActivation, 1000 * 60 * 60); // Check every hour
    return () => clearInterval(interval);
  }, []);

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
          <strong className="font-bold">License Expired!</strong>
          <span className="block sm:inline"> Your application license has expired. Please contact support to renew.</span>
        </div>
      )}
      
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold">Inventory Items</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsCategoryManagerOpen(true)}>
            <Tags className="h-4 w-4 mr-2" />
            Categories
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
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
            Add Item
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package2 className="h-5 w-5" />
            Items List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Min. Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
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
                      Edit
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
                <h4 className="font-semibold">Description</h4>
                <p>{selectedItem.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Category</h4>
                  <p>{selectedItem.category}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Current Stock</h4>
                  <p className={selectedItem.quantity <= selectedItem.minQuantity ? "text-red-500" : ""}>
                    {selectedItem.quantity}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Minimum Stock Level</h4>
                  <p>{selectedItem.minQuantity}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Price</h4>
                  <p>${selectedItem.cost ? selectedItem.cost.toFixed(2) : '0.00'}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Last Updated</h4>
                  <p>{new Date(selectedItem.lastUpdated).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="text-sm text-muted-foreground">
        <h2 className="font-semibold mb-2">Quick Tips</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Click on an item's name to view detailed information</li>
          <li>Use the search bar to filter items by name, category, or description</li>
          <li>Items highlighted in red indicate low stock levels</li>
          <li>Export your data regularly to keep a backup</li>
          <li>Use the Categories button to manage your item categories</li>
        </ul>
      </div>
    </div>
  );
}
