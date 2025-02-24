
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  minQuantity: number;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
}
