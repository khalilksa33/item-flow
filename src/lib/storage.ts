
import { InventoryItem, Category } from "@/types/inventory";

const ITEMS_KEY = 'inventory_items';
const CATEGORIES_KEY = 'inventory_categories';

export const storage = {
  // Items operations
  getItems: (): InventoryItem[] => {
    const items = localStorage.getItem(ITEMS_KEY);
    return items ? JSON.parse(items) : [];
  },

  setItems: (items: InventoryItem[]) => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  },

  addItem: (item: InventoryItem) => {
    const items = storage.getItems();
    items.push(item);
    storage.setItems(items);
  },

  // Categories operations
  getCategories: (): Category[] => {
    const categories = localStorage.getItem(CATEGORIES_KEY);
    return categories ? JSON.parse(categories) : [
      { id: '1', name: 'Electronics' },
      { id: '2', name: 'Office Supplies' },
      { id: '3', name: 'Furniture' }
    ];
  },

  setCategories: (categories: Category[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },

  // Initialize default data if empty
  initializeData: () => {
    if (!localStorage.getItem(ITEMS_KEY)) {
      const defaultItems: InventoryItem[] = [
        {
          id: '1',
          name: 'Laptop',
          description: 'Business laptop with 16GB RAM',
          quantity: 5,
          category: 'Electronics',
          minQuantity: 2,
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Office Chair',
          description: 'Ergonomic office chair',
          quantity: 10,
          category: 'Furniture',
          minQuantity: 3,
          lastUpdated: new Date().toISOString()
        }
      ];
      storage.setItems(defaultItems);
    }

    if (!localStorage.getItem(CATEGORIES_KEY)) {
      storage.setCategories([
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Office Supplies' },
        { id: '3', name: 'Furniture' }
      ]);
    }
  }
};
