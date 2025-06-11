
import { InventoryItem, Customer, Vendor, Sale, Quotation, Invoice, User, Category, Supplier, AuditLog } from "@/types/inventory";

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
};

import { seedSampleData } from "@/utils/sampleDataSeeder";

export const storage = {
  // Inventory Items
  getInventoryItems: () => {
    const items = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return items ? JSON.parse(items) : [];
  },
  getItems: () => {
    // Alias for getInventoryItems
    return storage.getInventoryItems();
  },
  addInventoryItem: (item: InventoryItem) => {
    const items = storage.getInventoryItems();
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify([...items, item]));
  },
  updateInventoryItem: (item: InventoryItem) => {
    const items = storage.getInventoryItems().map(i => i.id === item.id ? item : i);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  },
  deleteInventoryItem: (id: string) => {
    const items = storage.getInventoryItems().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  },

  // Customers
  getCustomers: () => {
    const customers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return customers ? JSON.parse(customers) : [];
  },
  addCustomer: (customer: Customer) => {
    const customers = storage.getCustomers();
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([...customers, customer]));
  },
  updateCustomer: (customer: Customer) => {
    const customers = storage.getCustomers().map(c => c.id === customer.id ? customer : c);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },
  deleteCustomer: (id: string) => {
    const customers = storage.getCustomers().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  // Vendors
  getVendors: () => {
    const vendors = localStorage.getItem(STORAGE_KEYS.VENDORS);
    return vendors ? JSON.parse(vendors) : [];
  },
  addVendor: (vendor: Vendor) => {
    const vendors = storage.getVendors();
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify([...vendors, vendor]));
  },
  updateVendor: (vendor: Vendor) => {
    const vendors = storage.getVendors().map(v => v.id === vendor.id ? vendor : v);
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  },
  deleteVendor: (id: string) => {
    const vendors = storage.getVendors().filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  },

  // Sales
  getSales: () => {
    const sales = localStorage.getItem(STORAGE_KEYS.SALES);
    return sales ? JSON.parse(sales) : [];
  },
  addSale: (sale: Sale) => {
    const sales = storage.getSales();
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([...sales, sale]));
  },
  updateSale: (sale: Sale) => {
    const sales = storage.getSales().map(s => s.id === sale.id ? sale : s);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },
  deleteSale: (id: string) => {
    const sales = storage.getSales().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  // Quotations
  getQuotations: () => {
    const quotations = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    return quotations ? JSON.parse(quotations) : [];
  },
  addQuotation: (quotation: Quotation) => {
    const quotations = storage.getQuotations();
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify([...quotations, quotation]));
  },
  updateQuotation: (quotation: Quotation) => {
    const quotations = storage.getQuotations().map(q => q.id === quotation.id ? quotation : q);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  },
  deleteQuotation: (id: string) => {
    const quotations = storage.getQuotations().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  },

  // Invoices
  getInvoices: () => {
    const invoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
    return invoices ? JSON.parse(invoices) : [];
  },
  addInvoice: (invoice: Invoice) => {
    const invoices = storage.getInvoices();
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([...invoices, invoice]));
  },
  updateInvoice: (invoice: Invoice) => {
    const invoices = storage.getInvoices().map(i => i.id === invoice.id ? invoice : i);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },
  deleteInvoice: (id: string) => {
    const invoices = storage.getInvoices().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  },

  // Users
  getUsers: () => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },
  addUser: (user: User) => {
    const users = storage.getUsers();
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([...users, user]));
  },
  updateUser: (user: User) => {
    const users = storage.getUsers().map(u => u.id === user.id ? user : u);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  deleteUser: (id: string) => {
    const users = storage.getUsers().filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // Categories
  getCategories: () => {
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categories ? JSON.parse(categories) : [];
  },
  addCategory: (category: Category) => {
    const categories = storage.getCategories();
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([...categories, category]));
  },
  deleteCategory: (id: string) => {
    const categories = storage.getCategories().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // Suppliers
  getSuppliers: () => {
    const suppliers = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return suppliers ? JSON.parse(suppliers) : [];
  },
  addSupplier: (supplier: Supplier) => {
    const suppliers = storage.getSuppliers();
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify([...suppliers, supplier]));
  },
  updateSupplier: (supplier: Supplier) => {
    const suppliers = storage.getSuppliers().map(s => s.id === supplier.id ? supplier : s);
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  },
  deleteSupplier: (id: string) => {
    const suppliers = storage.getSuppliers().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  },

  // Audit Logs
  getAuditLogs: () => {
    const auditLogs = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return auditLogs ? JSON.parse(auditLogs) : [];
  },
  addAuditLog: (log: AuditLog) => {
    const logs = storage.getAuditLogs();
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify([...logs, log]));
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
    const headers = ['Name', 'SKU', 'Category', 'Quantity', 'Cost', 'Price', 'Supplier'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        item.name,
        item.sku,
        item.category,
        item.quantity,
        item.cost || 0,
        item.price || 0,
        item.supplier || ''
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
              sku: values[1] || '',
              category: values[2] || '',
              quantity: parseInt(values[3]) || 0,
              cost: parseFloat(values[4]) || 0,
              price: parseFloat(values[5]) || 0,
              supplier: values[6] || '',
              minQuantity: 5,
              description: '',
              barcode: '',
              location: '',
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
