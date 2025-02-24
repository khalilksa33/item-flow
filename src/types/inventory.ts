
export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  minQuantity: number;
  lastUpdated: string;
  imageUrl?: string;
  cost?: number;
  stockMovements: StockMovement[];
}

export interface Category {
  id: string;
  name: string;
}

export interface StockMovement {
  id: string;
  date: string;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
}

export interface AnalyticsData {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  movementsToday: number;
  stockByCategory: {
    category: string;
    count: number;
  }[];
}
