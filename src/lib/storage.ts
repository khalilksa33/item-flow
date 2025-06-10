import { InventoryItem, Customer, Vendor, Sale, Quotation, Invoice } from "@/types/inventory";

const STORAGE_KEYS = {
  INVENTORY: 'inventory_items',
  CUSTOMERS: 'inventory_customers',
  VENDORS: 'inventory_vendors',
  SALES: 'inventory_sales',
  QUOTATIONS: 'inventory_quotations',
  INVOICES: 'inventory_invoices',
  USERS: 'inventory_users',
};

/**
 * Local Storage Utility
 */
class LocalStorageService {
  constructor() {
    if (typeof localStorage === 'undefined') {
      console.warn('localStorage is not available in this environment');
    }
  }

  /**
   * Get all inventory items
   */
  getInventoryItems(): InventoryItem[] {
    try {
      const items = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error("Error getting inventory items:", error);
      return [];
    }
  }

  /**
   * Add a new inventory item
   * @param item 
   */
  addInventoryItem(item: InventoryItem): void {
    const items = this.getInventoryItems();
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify([...items, item]));
  }

  /**
   * Update an existing inventory item
   * @param item 
   */
  updateInventoryItem(item: InventoryItem): void {
    const items = this.getInventoryItems().map(i => i.id === item.id ? item : i);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  }

  /**
   * Delete an inventory item
   * @param id 
   */
  deleteInventoryItem(id: string): void {
    const items = this.getInventoryItems().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(items));
  }

  /**
   * Get all customers
   */
  getCustomers(): Customer[] {
    try {
      const customers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return customers ? JSON.parse(customers) : [];
    } catch (error) {
      console.error("Error getting customers:", error);
      return [];
    }
  }

  /**
   * Add a new customer
   * @param customer 
   */
  addCustomer(customer: Customer): void {
    const customers = this.getCustomers();
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([...customers, customer]));
  }

  /**
   * Update an existing customer
   * @param customer 
   */
  updateCustomer(customer: Customer): void {
    const customers = this.getCustomers().map(c => c.id === customer.id ? customer : c);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

  /**
   * Delete a customer
   * @param id 
   */
  deleteCustomer(id: string): void {
    const customers = this.getCustomers().filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }

    /**
   * Get all vendors
   */
  getVendors(): Vendor[] {
    try {
      const vendors = localStorage.getItem(STORAGE_KEYS.VENDORS);
      return vendors ? JSON.parse(vendors) : [];
    } catch (error) {
      console.error("Error getting vendors:", error);
      return [];
    }
  }

  /**
   * Add a new vendor
   * @param vendor 
   */
  addVendor(vendor: Vendor): void {
    const vendors = this.getVendors();
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify([...vendors, vendor]));
  }

  /**
   * Update an existing vendor
   * @param vendor 
   */
  updateVendor(vendor: Vendor): void {
    const vendors = this.getVendors().map(v => v.id === vendor.id ? vendor : v);
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  }

  /**
   * Delete a vendor
   * @param id 
   */
  deleteVendor(id: string): void {
    const vendors = this.getVendors().filter(v => v.id !== id);
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  }

  /**
   * Get all sales
   */
  getSales(): Sale[] {
    try {
      const sales = localStorage.getItem(STORAGE_KEYS.SALES);
      return sales ? JSON.parse(sales) : [];
    } catch (error) {
      console.error("Error getting sales:", error);
      return [];
    }
  }

  /**
   * Add a new sale
   * @param sale 
   */
  addSale(sale: Sale): void {
    const sales = this.getSales();
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify([...sales, sale]));
  }

   /**
   * Update an existing sale
   * @param sale 
   */
  updateSale(sale: Sale): void {
    const sales = this.getSales().map(s => s.id === sale.id ? sale : s);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }

  /**
   * Delete a sale
   * @param id 
   */
  deleteSale(id: string): void {
    const sales = this.getSales().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }

  /**
   * Get all quotations
   */
  getQuotations(): Quotation[] {
    try {
      const quotations = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
      return quotations ? JSON.parse(quotations) : [];
    } catch (error) {
      console.error("Error getting quotations:", error);
      return [];
    }
  }

  /**
   * Add a new quotation
   * @param quotation 
   */
  addQuotation(quotation: Quotation): void {
    const quotations = this.getQuotations();
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify([...quotations, quotation]));
  }

   /**
   * Update an existing quotation
   * @param quotation 
   */
  updateQuotation(quotation: Quotation): void {
    const quotations = this.getQuotations().map(q => q.id === quotation.id ? quotation : q);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  }

  /**
   * Delete a quotation
   * @param id 
   */
  deleteQuotation(id: string): void {
    const quotations = this.getQuotations().filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations));
  }

  /**
   * Get all invoices
   */
  getInvoices(): Invoice[] {
    try {
      const invoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
      return invoices ? JSON.parse(invoices) : [];
    } catch (error) {
      console.error("Error getting invoices:", error);
      return [];
    }
  }

  /**
   * Add a new invoice
   * @param invoice 
   */
  addInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices();
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([...invoices, invoice]));
  }

   /**
   * Update an existing invoice
   * @param invoice 
   */
  updateInvoice(invoice: Invoice): void {
    const invoices = this.getInvoices().map(i => i.id === invoice.id ? invoice : i);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }

  /**
   * Delete a invoice
   * @param id 
   */
  deleteInvoice(id: string): void {
    const invoices = this.getInvoices().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
  }
}

import { seedSampleData } from "@/utils/sampleDataSeeder";

export const storage = {
  getInventoryItems: () => {
    const items = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return items ? JSON.parse(items) : [];
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
  initializeData: () => {
    // Initialize default admin user if no users exist
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.length === 0) {
      const defaultAdmin = {
        id: crypto.randomUUID(),
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
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
