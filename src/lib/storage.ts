import { InventoryItem, Category, Supplier, User, AuditLog, Customer, Vendor, Sale, Quotation, Invoice } from "@/types/inventory";

const ITEMS_KEY = 'inventory_items';
const CATEGORIES_KEY = 'inventory_categories';
const SUPPLIERS_KEY = 'inventory_suppliers';
const USERS_KEY = 'inventory_users';
const AUDIT_LOGS_KEY = 'inventory_audit_logs';
const CURRENT_USER_KEY = 'inventory_current_user';
const CUSTOMERS_KEY = 'inventory_customers';
const VENDORS_KEY = 'inventory_vendors';
const SALES_KEY = 'inventory_sales';
const QUOTATIONS_KEY = 'inventory_quotations';
const INVOICES_KEY = 'inventory_invoices';

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

  // Customer operations
  getCustomers: (): Customer[] => {
    const customers = localStorage.getItem(CUSTOMERS_KEY);
    return customers ? JSON.parse(customers) : [];
  },

  setCustomers: (customers: Customer[]) => {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  },

  addCustomer: (customer: Customer) => {
    const customers = storage.getCustomers();
    customers.push(customer);
    storage.setCustomers(customers);
  },

  updateCustomer: (updatedCustomer: Customer) => {
    const customers = storage.getCustomers();
    const index = customers.findIndex(customer => customer.id === updatedCustomer.id);
    if (index !== -1) {
      customers[index] = updatedCustomer;
      storage.setCustomers(customers);
    }
  },

  deleteCustomer: (id: string) => {
    const customers = storage.getCustomers();
    const filteredCustomers = customers.filter(customer => customer.id !== id);
    storage.setCustomers(filteredCustomers);
  },

  // Vendor operations
  getVendors: (): Vendor[] => {
    const vendors = localStorage.getItem(VENDORS_KEY);
    return vendors ? JSON.parse(vendors) : [];
  },

  setVendors: (vendors: Vendor[]) => {
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
  },

  addVendor: (vendor: Vendor) => {
    const vendors = storage.getVendors();
    vendors.push(vendor);
    storage.setVendors(vendors);
  },

  updateVendor: (updatedVendor: Vendor) => {
    const vendors = storage.getVendors();
    const index = vendors.findIndex(vendor => vendor.id === updatedVendor.id);
    if (index !== -1) {
      vendors[index] = updatedVendor;
      storage.setVendors(vendors);
    }
  },

  deleteVendor: (id: string) => {
    const vendors = storage.getVendors();
    const filteredVendors = vendors.filter(vendor => vendor.id !== id);
    storage.setVendors(filteredVendors);
  },

  // Sales operations
  getSales: (): Sale[] => {
    const sales = localStorage.getItem(SALES_KEY);
    return sales ? JSON.parse(sales) : [];
  },

  setSales: (sales: Sale[]) => {
    localStorage.setItem(SALES_KEY, JSON.stringify(sales));
  },

  addSale: (sale: Sale) => {
    const sales = storage.getSales();
    sales.push(sale);
    storage.setSales(sales);
  },

  updateSale: (updatedSale: Sale) => {
    const sales = storage.getSales();
    const index = sales.findIndex(sale => sale.id === updatedSale.id);
    if (index !== -1) {
      sales[index] = updatedSale;
      storage.setSales(sales);
    }
  },

  deleteSale: (id: string) => {
    const sales = storage.getSales();
    const filteredSales = sales.filter(sale => sale.id !== id);
    storage.setSales(filteredSales);
  },

  // Quotations operations
  getQuotations: (): Quotation[] => {
    const quotations = localStorage.getItem(QUOTATIONS_KEY);
    return quotations ? JSON.parse(quotations) : [];
  },

  setQuotations: (quotations: Quotation[]) => {
    localStorage.setItem(QUOTATIONS_KEY, JSON.stringify(quotations));
  },

  addQuotation: (quotation: Quotation) => {
    const quotations = storage.getQuotations();
    quotations.push(quotation);
    storage.setQuotations(quotations);
  },

  updateQuotation: (updatedQuotation: Quotation) => {
    const quotations = storage.getQuotations();
    const index = quotations.findIndex(q => q.id === updatedQuotation.id);
    if (index !== -1) {
      quotations[index] = updatedQuotation;
      storage.setQuotations(quotations);
    }
  },

  deleteQuotation: (id: string) => {
    const quotations = storage.getQuotations();
    const filteredQuotations = quotations.filter(q => q.id !== id);
    storage.setQuotations(filteredQuotations);
  },

  // Invoices operations
  getInvoices: (): Invoice[] => {
    const invoices = localStorage.getItem(INVOICES_KEY);
    return invoices ? JSON.parse(invoices) : [];
  },

  setInvoices: (invoices: Invoice[]) => {
    localStorage.setItem(INVOICES_KEY, JSON.stringify(invoices));
  },

  addInvoice: (invoice: Invoice) => {
    const invoices = storage.getInvoices();
    invoices.push(invoice);
    storage.setInvoices(invoices);
  },

  updateInvoice: (updatedInvoice: Invoice) => {
    const invoices = storage.getInvoices();
    const index = invoices.findIndex(i => i.id === updatedInvoice.id);
    if (index !== -1) {
      invoices[index] = updatedInvoice;
      storage.setInvoices(invoices);
    }
  },

  deleteInvoice: (id: string) => {
    const invoices = storage.getInvoices();
    const filteredInvoices = invoices.filter(i => i.id !== id);
    storage.setInvoices(filteredInvoices);
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

    if (!localStorage.getItem(CUSTOMERS_KEY)) {
      const defaultCustomers: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-0123',
          address: '123 Main St',
          type: 'individual',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Acme Corp',
          email: 'contact@acme.com',
          phone: '555-0456',
          address: '456 Business Ave',
          type: 'business',
          taxId: '12-3456789',
          creditLimit: 10000,
          paymentTerms: 'Net 30',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      ];
      storage.setCustomers(defaultCustomers);
    }

    if (!localStorage.getItem(VENDORS_KEY)) {
      const defaultVendors: Vendor[] = [
        {
          id: '1',
          name: 'TechCorp Supplies',
          email: 'sales@techcorp.com',
          phone: '555-0123',
          address: '123 Tech Street',
          notes: 'Primary electronics supplier',
          type: 'manufacturer',
          products: ['Electronics', 'Components'],
          paymentTerms: 'Net 45',
          taxId: '98-7654321',
          rating: 4.5,
          activeContract: true
        },
        {
          id: '2',
          name: 'Office Furniture Co',
          email: 'contact@officefurniture.com',
          phone: '555-0456',
          address: '456 Office Road',
          notes: 'Furniture supplier',
          type: 'wholesaler',
          products: ['Furniture', 'Office Supplies'],
          paymentTerms: 'Net 30',
          taxId: '45-6789123',
          rating: 4.0,
          activeContract: true
        }
      ];
      storage.setVendors(defaultVendors);
    }

    if (!localStorage.getItem(SALES_KEY)) {
      const sampleSales: Sale[] = [
        {
          id: '1',
          customerId: '1',
          items: [
            {
              id: crypto.randomUUID(),
              productId: '1',
              quantity: 2,
              unitPrice: 999.99,
              subtotal: 1999.98
            }
          ],
          total: 1999.98,
          status: 'completed',
          paymentStatus: 'paid',
          paymentMethod: 'credit_card',
          date: new Date().toISOString(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      storage.setSales(sampleSales);
    }
  },

  // Activation management
  getActivationStatus: () => {
    const activation = localStorage.getItem('activation_status');
    if (!activation) {
      const initialActivation = {
        active: true,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        activatedOn: new Date().toISOString(),
        isPerpetual: false
      };
      localStorage.setItem('activation_status', JSON.stringify(initialActivation));
      return initialActivation;
    }
    return JSON.parse(activation);
  },

  setActivationStatus: (status: { active: boolean; expiryDate: string; activatedOn: string; isPerpetual: boolean }) => {
    localStorage.setItem('activation_status', JSON.stringify(status));
  },

  setPerpetualActivation: () => {
    const status = storage.getActivationStatus();
    storage.setActivationStatus({
      ...status,
      active: true,
      isPerpetual: true,
      expiryDate: new Date('2099-12-31').toISOString()
    });
  },

  checkActivation: () => {
    const status = storage.getActivationStatus();
    if (status.isPerpetual) return true;
    const now = new Date();
    const expiryDate = new Date(status.expiryDate);
    return status.active && now < expiryDate;
  },

  extendActivation: (days: number = 30) => {
    const status = storage.getActivationStatus();
    const currentExpiry = new Date(status.expiryDate);
    const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);
    storage.setActivationStatus({
      ...status,
      expiryDate: newExpiry.toISOString()
    });
  },

  // CSV export
  exportToCSV: () => {
    const items = storage.getItems();
    const headers = [
      'id',
      'name',
      'description',
      'quantity',
      'category',
      'minQuantity',
      'cost',
      'lastUpdated',
      'supplierId'
    ];

    const csvRows = [
      headers.join(','),
      ...items.map(item => 
        headers.map(header => {
          const value = item[header as keyof typeof item];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ];

    return csvRows.join('\n');
  },

  // CSV import
  importFromCSV: (csvContent: string) => {
    try {
      const rows = csvContent.split('\n');
      const headers = rows[0].split(',');
      
      const items = rows.slice(1).map(row => {
        const values = row.split(',');
        const item: any = {};
        
        headers.forEach((header, index) => {
          if (['quantity', 'minQuantity', 'cost'].includes(header)) {
            item[header] = parseFloat(values[index]) || 0;
          } else {
            item[header] = values[index]?.replace(/^"(.*)"$/, '$1') || '';
          }
        });

        item.stockMovements = item.stockMovements || [];
        item.lastUpdated = item.lastUpdated || new Date().toISOString();
        
        return item;
      });

      storage.setItems(items);
      return true;
    } catch (error) {
      console.error('Error importing CSV:', error);
      return false;
    }
  }
};
