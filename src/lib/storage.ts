import { InventoryItem, Category, Supplier, User, AuditLog } from "@/types/inventory";

const ITEMS_KEY = 'inventory_items';
const CATEGORIES_KEY = 'inventory_categories';
const SUPPLIERS_KEY = 'inventory_suppliers';
const USERS_KEY = 'inventory_users';
const AUDIT_LOGS_KEY = 'inventory_audit_logs';
const CURRENT_USER_KEY = 'inventory_current_user';

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

    const currentUser = storage.getCurrentUser();
    if (currentUser) {
      storage.addAuditLog({
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        action: 'create',
        itemId: item.id,
        userId: currentUser.id,
        details: `Created item: ${item.name}`
      });
    }
  },

  updateItem: (updatedItem: InventoryItem) => {
    const items = storage.getItems();
    const index = items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      items[index] = { ...updatedItem, lastUpdated: new Date().toISOString() };
      storage.setItems(items);

      const currentUser = storage.getCurrentUser();
      if (currentUser) {
        storage.addAuditLog({
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          action: 'update',
          itemId: updatedItem.id,
          userId: currentUser.id,
          details: `Updated item: ${updatedItem.name}`
        });
      }
    }
  },

  deleteItem: (id: string) => {
    const items = storage.getItems();
    const item = items.find(i => i.id === id);
    const filteredItems = items.filter(item => item.id !== id);
    storage.setItems(filteredItems);

    if (item) {
      const currentUser = storage.getCurrentUser();
      if (currentUser) {
        storage.addAuditLog({
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          action: 'delete',
          itemId: id,
          userId: currentUser.id,
          details: `Deleted item: ${item.name}`
        });
      }
    }
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

  addCategory: (category: Category) => {
    const categories = storage.getCategories();
    categories.push(category);
    storage.setCategories(categories);
  },

  deleteCategory: (id: string) => {
    const categories = storage.getCategories();
    const filteredCategories = categories.filter(category => category.id !== id);
    storage.setCategories(filteredCategories);
  },

  // Suppliers operations
  getSuppliers: (): Supplier[] => {
    const suppliers = localStorage.getItem(SUPPLIERS_KEY);
    return suppliers ? JSON.parse(suppliers) : [];
  },

  setSuppliers: (suppliers: Supplier[]) => {
    localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(suppliers));
  },

  addSupplier: (supplier: Supplier) => {
    const suppliers = storage.getSuppliers();
    suppliers.push(supplier);
    storage.setSuppliers(suppliers);
  },

  updateSupplier: (updatedSupplier: Supplier) => {
    const suppliers = storage.getSuppliers();
    const index = suppliers.findIndex(supplier => supplier.id === updatedSupplier.id);
    if (index !== -1) {
      suppliers[index] = updatedSupplier;
      storage.setSuppliers(suppliers);
    }
  },

  deleteSupplier: (id: string) => {
    const suppliers = storage.getSuppliers();
    const filteredSuppliers = suppliers.filter(supplier => supplier.id !== id);
    storage.setSuppliers(filteredSuppliers);
  },

  getSupplierById: (id: string): Supplier | undefined => {
    const suppliers = storage.getSuppliers();
    return suppliers.find(supplier => supplier.id === id);
  },

  // User operations
  getUsers: (): User[] => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  },

  setUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  addUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    storage.setUsers(users);
  },

  updateUser: (updatedUser: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(user => user.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      storage.setUsers(users);
    }
  },

  deleteUser: (id: string) => {
    const users = storage.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    storage.setUsers(filteredUsers);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // Audit logging operations
  getAuditLogs: (): AuditLog[] => {
    const logs = localStorage.getItem(AUDIT_LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
  },

  addAuditLog: (log: AuditLog) => {
    const logs = storage.getAuditLogs();
    logs.push(log);
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(logs));
  },

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
          lastUpdated: new Date().toISOString(),
          cost: 999.99,
          stockMovements: [],
          imageUrl: '',
          barcode: '123456789',
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=123456789',
          supplierId: '1'
        },
        {
          id: '2',
          name: 'Office Chair',
          description: 'Ergonomic office chair',
          quantity: 10,
          category: 'Furniture',
          minQuantity: 3,
          lastUpdated: new Date().toISOString(),
          cost: 199.99,
          stockMovements: [],
          imageUrl: '',
          barcode: '987654321',
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=987654321',
          supplierId: '2'
        }
      ];
      storage.setItems(defaultItems);
    }

    if (!localStorage.getItem(SUPPLIERS_KEY)) {
      const defaultSuppliers: Supplier[] = [
        {
          id: '1',
          name: 'TechCorp Supplies',
          email: 'sales@techcorp.com',
          phone: '555-0123',
          address: '123 Tech Street',
          notes: 'Primary electronics supplier'
        },
        {
          id: '2',
          name: 'Office Furniture Co',
          email: 'contact@officefurniture.com',
          phone: '555-0456',
          address: '456 Office Road',
          notes: 'Furniture supplier'
        }
      ];
      storage.setSuppliers(defaultSuppliers);
    }

    if (!localStorage.getItem(CATEGORIES_KEY)) {
      storage.setCategories([
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Office Supplies' },
        { id: '3', name: 'Furniture' }
      ]);
    }

    if (!localStorage.getItem(USERS_KEY)) {
      const defaultUsers: User[] = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          role: 'admin'
        },
        {
          id: '2',
          username: 'manager',
          password: 'manager123',
          role: 'manager'
        },
        {
          id: '3',
          username: 'viewer',
          password: 'viewer123',
          role: 'viewer'
        }
      ];
      storage.setUsers(defaultUsers);
    }
  }
};
