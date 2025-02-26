
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ItemForm } from "@/components/ItemForm";
import { InventoryList } from "@/components/InventoryList";
import { storage } from "@/lib/storage";
import { InventoryItem } from "@/types/inventory";
import { toast } from "sonner";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>(storage.getItems());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const { t, i18n } = useTranslation(["inventory", "common"]);
  const isRTL = i18n.language === 'ar';

  const loadItems = () => {
    setItems(storage.getItems());
  };

  const handleSubmit = () => {
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
    toast.success(t("inventory.itemDeleted"));
  };

  return (
    <div className="container mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("common:back")}
          </Button>
        </Link>
        <LanguageSwitcher />
      </div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("inventory:title")}</h1>
        <Button onClick={() => {
          setEditingItem(null);
          setIsDialogOpen(true);
        }}>
          {t("inventory:addItem")}
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
              {editingItem ? t("inventory:edit") : t("inventory:addItem")}
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
