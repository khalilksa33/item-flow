
import { useEffect, useState } from "react";
import { InventoryItem } from "@/types/inventory";
import { storage } from "@/lib/storage";
import { InventoryAnalytics } from "./InventoryAnalytics";
import { useTranslation } from "react-i18next";

export function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    storage.initializeData();
    const inventoryItems = storage.getItems();
    setItems(inventoryItems);
  }, []);

  return (
    <div className="p-6" dir={isRTL ? "rtl" : "ltr"}>
      <InventoryAnalytics items={items} />
    </div>
  );
}
