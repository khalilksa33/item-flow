
import { useEffect, useState } from "react";
import { InventoryItem } from "@/types/inventory";
import { storage } from "@/lib/storage";
import { InventoryAnalytics } from "./InventoryAnalytics";

export function Dashboard() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    storage.initializeData();
    const inventoryItems = storage.getItems();
    setItems(inventoryItems);
  }, []);

  return (
    <div className="p-6">
      <InventoryAnalytics items={items} />
    </div>
  );
}
