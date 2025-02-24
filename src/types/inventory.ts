
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
  barcode?: string;
  qrCode?: string;
  supplierId?: string;
  lastModifiedBy?: string;
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
  userId: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'business';
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: string;
  notes?: string;
  createdAt: string;
  lastUpdated: string;
}

export interface Vendor extends Supplier {
  type: 'manufacturer' | 'wholesaler' | 'distributor';
  products: string[];
  paymentTerms: string;
  taxId: string;
  rating?: number;
  activeContract?: boolean;
  lastOrderDate?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'manager' | 'viewer';
  lastLogin?: string;
}

export interface AuditLog {
  id: string;
  date: string;
  action: 'create' | 'update' | 'delete';
  itemId: string;
  userId: string;
  details: string;
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
