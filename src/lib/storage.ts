import { InventoryItem, Customer, Vendor, Sale, Quotation, Invoice, User, Category, Supplier, AuditLog } from "@/types/inventory";
import { seedSampleData } from "@/utils/sampleDataSeeder";
import {
  inventoryApi,
  customersApi,
  vendorsApi,
  salesApi,
  quotationsApi,
  invoicesApi,
  usersApi,
  categoriesApi,
  suppliersApi,
  auditLogsApi,
  settingsApi,
  tokenStore
} from "./api";

const STORAGE_KEYS = {
  INVENTORY: 'inventory_items',
  CUSTOMERS: 'inventory_customers',
  VENDORS: 'inventory_vendors',
  SALES: 'inventory_sales',
  QUOTATIONS: 'inventory_quotations',
  INVOICES: 'inventory_invoices',
  USERS: 'inventory_users',
  CATEGORIES: 'inventory_categories',
  SUPPLIERS: 'inventory_suppliers',
  AUDIT_LOGS: 'inventory_audit_logs',
  CURRENT_USER: 'inventory_current_user',
};

// ── LocalStorage proxy for settings sync ──────────────────────
const originalSetItem = window.localStorage.setItem;
const settingsKeys = [
  "companyName", "companyNameAr", "vatNumber", "crNumber",
  "companyAddress", "companyPhone", "companyEmail", "companyLogo",
  "footerNote", "footerNoteAr", "invoiceType",
  "timezone", "currency", "vatRate", "dateFormat"
];

let isSyncing = false;

window.localStorage.setItem = function(key, value) {
  originalSetItem.call(window.localStorage, key, value);
  if (!isSyncing && settingsKeys.includes(key)) {
    if (tokenStore.get()) {
      settingsApi.update({ [key]: value }).catch(err => {
        console.error('Failed to sync setting to backend:', key, err);
      });
    }
  }
};

export const storage = {
  // Synchronization
  syncWithBackend: async () => {
    if (!tokenStore.get()) return;
    isSyncing = true;
    try {
      const [
        inventory,
        customers,
        vendors,
        sales,
        quotations,
        invoices,
        users,
        categories,
        suppliers,
        auditLogs,
        settings
      ] = await Promise.all([
        inventoryApi.getAll().catch(e => { console.error('Error fetching inventory:', e); return null; }),
        customersApi.getAll().catch(e => { console.error('Error fetching customers:', e); return null; }),
        vendorsApi.getAll().catch(e => { console.error('Error fetching vendors:', e); return null; }),
        salesApi.getAll().catch(e => { console.error('Error fetching sales:', e); return null; }),
        quotationsApi.getAll().catch(e => { console.error('Error fetching quotations:', e); return null; }),
        invoicesApi.getAll().catch(e => { console.error('Error fetching invoices:', e); return null; }),
        usersApi.getAll().catch(e => { console.error('Error fetching users:', e); return null; }),
        categoriesApi.getAll().catch(e => { console.error('Error fetching categories:', e); return null; }),
        suppliersApi.getAll().catch(e => { console.error('Error fetching suppliers:', e); return null; }),
        auditLogsApi.getAll().catch(e => { console.error('Error fetching audit logs:', e); return null; }),
        settingsApi.getAll().catch(e => { console.error('Error fetching settings:', e); return null; }),
      ]);

      if (inventory !== null) localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
      if (customers !== null) localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      if (vendors !== null) localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
      if (sales !== null) localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
      if (quotations !== null) localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
      if (invoices !== null) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
      if (users !== null) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      if (categories !== null) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      if (suppliers !== null) localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
      if (auditLogs !== null) localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));

      if (settings !== null) {
        Object.entries(settings).forEach(([key, value]) => {
          originalSetItem.call(window.localStorage, key, value);
        });
      }
      console.log('✅ Synchronized all data from MongoDB successfully');
    } catch (error) {
      console.error('❌ Sync error:', error);
    } finally {
      isSyncing = false;
    }
  },

  // Inventory Items
  getInventoryItems: () => {
    const items = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return items ? JSON.parse(items) : [];
  },
  getItems: () => {
    return storage.getInventoryItems();
  },
  addInventoryItem: (item: InventoryItem) => {
    const items = storage.getInventoryItems();
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify([...items, item]));
    if (tokenStore.get()) {
      inventoryApi.create(item).catch(err => console.error('API Error:', err));
    }
  },
  addItem: (item: InventoryItem) => {
    return storage.addInventoryItem(item);
  },
  updateInventoryItem: (item: InventoryItem) => {
    const items = storage.getInventoryItems().map(i => i.id === item.id ? item : i);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
    if (tokenStore.get()) {
      inventoryApi.update(item.id, item).catch(err => console.error('API Error:', err));
    }
  },
  updateItem: (item: InventoryItem) => {
    return storage.updateInventoryItem(item);
  },
  deleteInventoryItem: (id: string) => {
    const items = storage.getInventoryItems().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
    if (tokenStore.get()) {
      inventoryApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },
  deleteItem: (id: string) => {
    return storage.deleteInventoryItem(id);
  },

  // Customers
  getCustomers: () => {
    const customers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return customers ? JSON.parse(customers) : [];
  },
  addCustomer: (customer: Customer) => {
    const customers = storage.getCustomers();
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([...customers, customer]));
    if (tokenStore.get()) {
      customersApi.create(customer).catch(err => console.error('API Error:', err));
    }
  },
  updateCustomer: (customer: Customer) => {
    const customers = storage.getCustomers().map(c => c.id === customer.id ? customer : c);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    if (tokenStore.get()) {
      customersApi.update(customer.id, customer).catch(err => console.error('API Error:', err));
    }
  },
  deleteCustomer: (id: string) => {
    const customers = storage.getCustomers().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    if (tokenStore.get()) {
      customersApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },

  // Vendors
  getVendors: () => {
    const vendors = localStorage.getItem(STORAGE_KEYS.VENDORS);
    return vendors ? JSON.parse(vendors) : [];
  },
  addVendor: (vendor: Vendor) => {
    const vendors = storage.getVendors();
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify([...vendors, vendor]));
    if (tokenStore.get()) {
      vendorsApi.create(vendor).catch(err => console.error('API Error:', err));
    }
  },
  updateVendor: (vendor: Vendor) => {
    const vendors = storage.getVendors().map(v => v.id === vendor.id ? vendor : v);
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
    if (tokenStore.get()) {
      vendorsApi.update(vendor.id, vendor).catch(err => console.error('API Error:', err));
    }
  },
  deleteVendor: (id: string) => {
    const vendors = storage.getVendors().filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
    if (tokenStore.get()) {
      vendorsApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },

  // Sales
  getSales: () => {
    const sales = localStorage.getItem(STORAGE_KEYS.SALES);
    return sales ? JSON.parse(sales) : [];
  },
  addSale: (sale: Sale) => {
    const sales = storage.getSales();
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([...sales, sale]));
    if (tokenStore.get()) {
      salesApi.create(sale).catch(err => console.error('API Error:', err));
    }
  },
  updateSale: (sale: Sale) => {
    const sales = storage.getSales().map(s => s.id === sale.id ? sale : s);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    if (tokenStore.get()) {
      salesApi.update(sale.id, sale).catch(err => console.error('API Error:', err));
    }
  },
  deleteSale: (id: string) => {
    const sales = storage.getSales().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
    if (tokenStore.get()) {
      salesApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },

  // Quotations
  getQuotations: () => {
    const quotations = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return quotations ? JSON.parse(quotations) : [];
  },
  addQuotation: (quotation: Quotation) => {
    const quotations = storage.getQuotations();
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify([...quotations, quotation]));
    if (tokenStore.get()) {
      quotationsApi.create(quotation).catch(err => console.error('API Error:', err));
    }
  },
  updateQuotation: (quotation: Quotation) => {
    const quotations = storage.getQuotations().map(q => q.id === quotation.id ? quotation : q);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
    if (tokenStore.get()) {
      quotationsApi.update(quotation.id, quotation).catch(err => console.error('API Error:', err));
    }
  },
  deleteQuotation: (id: string) => {
    const quotations = storage.getQuotations().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
    if (tokenStore.get()) {
      quotationsApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },

  // Invoices
  getInvoices: () => {
    const invoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return invoices ? JSON.parse(invoices) : [];
  },
  addInvoice: (invoice: Invoice) => {
    const invoices = storage.getInvoices();
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([...invoices, invoice]));
    if (tokenStore.get()) {
      invoicesApi.create(invoice).catch(err => console.error('API Error:', err));
    }
  },
  updateInvoice: (invoice: Invoice) => {
    const invoices = storage.getInvoices().map(i => i.id === invoice.id ? invoice : i);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    if (tokenStore.get()) {
      invoicesApi.update(invoice.id, invoice).catch(err => console.error('API Error:', err));
    }
  },
  deleteInvoice: (id: string) => {
    const invoices = storage.getInvoices().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    if (tokenStore.get()) {
      invoicesApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },

  // Users
  getUsers: () => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },
  addUser: (user: User) => {
    const users = storage.getUsers();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
    if (tokenStore.get()) {
      usersApi.create(user).catch(err => console.error('API Error:', err));
    }
  },
  updateUser: (user: User) => {
    const users = storage.getUsers().map(u => u.id === user.id ? user : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    if (tokenStore.get()) {
      usersApi.update(user.id, user).catch(err => console.error('API Error:', err));
    }
  },
  deleteUser: (id: string) => {
    const users = storage.getUsers().filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    if (tokenStore.get()) {
      usersApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Categories
  getCategories: () => {
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : [];
  },
  addCategory: (category: Category) => {
    const categories = storage.getCategories();
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([...categories, category]));
    if (tokenStore.get()) {
      categoriesApi.create(category).catch(err => console.error('API Error:', err));
    }
  },
  deleteCategory: (id: string) => {
    const categories = storage.getCategories().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    if (tokenStore.get()) {
      categoriesApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },

  // Suppliers
  getSuppliers: () => {
    const suppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return suppliers ? JSON.parse(suppliers) : [];
  },
  addSupplier: (supplier: Supplier) => {
    const suppliers = storage.getSuppliers();
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify([...suppliers, supplier]));
    if (tokenStore.get()) {
      suppliersApi.create(supplier).catch(err => console.error('API Error:', err));
    }
  },
  updateSupplier: (supplier: Supplier) => {
    const suppliers = storage.getSuppliers().map(s => s.id === supplier.id ? supplier : s);
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
    if (tokenStore.get()) {
      suppliersApi.update(supplier.id, supplier).catch(err => console.error('API Error:', err));
    }
  },
  deleteSupplier: (id: string) => {
    const suppliers = storage.getSuppliers().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
    if (tokenStore.get()) {
      suppliersApi.delete(id).catch(err => console.error('API Error:', err));
    }
  },

  // Audit Logs
  getAuditLogs: () => {
    const auditLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return auditLogs ? JSON.parse(auditLogs) : [];
  },
  addAuditLog: (log: AuditLog) => {
    const logs = storage.getAuditLogs();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([...logs, log]));
    if (tokenStore.get()) {
      auditLogsApi.create(log).catch(err => console.error('API Error:', err));
    }
  },

  // Data Management
  exportData: () => {
    return {
      inventory: storage.getInventoryItems(),
      customers: storage.getCustomers(),
      vendors: storage.getVendors(),
      sales: storage.getSales(),
      quotations: storage.getQuotations(),
      invoices: storage.getInvoices(),
      users: storage.getUsers(),
      categories: storage.getCategories(),
      suppliers: storage.getSuppliers(),
      auditLogs: storage.getAuditLogs(),
    };
  },
  importData: (data: any) => {
    if (data.inventory) localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(data.inventory));
    if (data.customers) localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(data.customers));
    if (data.vendors) localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(data.vendors));
    if (data.sales) localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(data.sales));
    if (data.quotations) localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(data.quotations));
    if (data.invoices) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(data.invoices));
    if (data.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
    if (data.categories) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
    if (data.suppliers) localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(data.suppliers));
    if (data.auditLogs) localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(data.auditLogs));
  },
  clearData: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  },

  // CSV Export/Import
  exportToCSV: (items: InventoryItem[]) => {
    const headers = ['Name', 'Category', 'Quantity', 'Cost', 'Description'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        item.name,
        item.category,
        item.quantity,
        item.cost || 0,
        item.description || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  },
  importFromCSV: (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          
          const items: InventoryItem[] = lines.slice(1).map((line, index) => {
            const values = line.split(',');
            return {
              id: crypto.randomUUID(),
              name: values[0] || '',
              category: values[1] || '',
              quantity: parseInt(values[2]) || 0,
              cost: parseFloat(values[3]) || 0,
              description: values[4] || '',
              minQuantity: 5,
              stockMovements: [],
              lastUpdated: new Date().toISOString()
            };
          }).filter(item => item.name); // Filter out empty rows

          resolve(items);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  },

  // Initialization and Activation
  initializeData: () => {
    // Initialize default admin user if no users exist
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.length === 0) {
      const defaultAdmin = {
        id: crypto.randomUUID(),
        username: 'admin',
        password: 'admin123',
        role: 'admin' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultAdmin]));
    }

    // Seed sample data if none exists
    seedSampleData();
  },
  checkActivation: () => {
    const status = localStorage.getItem('licenseStatus');
    return status === 'active' || status === 'trial';
  }
};
