
import { storage } from "@/lib/storage";
import { InventoryItem, Vendor, Customer } from "@/types/inventory";

export const seedSampleData = () => {
  // Check if sample data already exists
  const existingProducts = storage.getInventoryItems();
  const existingVendors = storage.getVendors();
  const existingCustomers = storage.getCustomers();

  if (existingProducts.length > 0 || existingVendors.length > 0 || existingCustomers.length > 0) {
    console.log("Sample data already exists, skipping seeding");
    return;
  }

  // Sample Vendors
  const sampleVendors: Vendor[] = [
    {
      id: crypto.randomUUID(),
      name: "Tech Solutions Ltd",
      email: "contact@techsolutions.com",
      phone: "+1-555-0101",
      address: "123 Technology Ave, Silicon Valley, CA 94000",
      notes: "Primary electronics supplier",
      type: "manufacturer",
      products: ["electronics", "accessories"],
      paymentTerms: "Net 30",
      taxId: "TS123456789",
      rating: 4.8,
      activeContract: true,
    },
    {
      id: crypto.randomUUID(),
      name: "Office Supplies Pro",
      email: "sales@officesuppliespro.com",
      phone: "+1-555-0202",
      address: "456 Business Blvd, New York, NY 10001",
      notes: "Office furniture and supplies",
      type: "wholesaler",
      products: ["furniture", "office-supplies"],
      paymentTerms: "Net 15",
      taxId: "OSP987654321",
      rating: 4.5,
      activeContract: true,
    },
    {
      id: crypto.randomUUID(),
      name: "Global Electronics",
      email: "info@globalelectronics.com",
      phone: "+1-555-0303",
      address: "789 International Dr, Miami, FL 33101",
      notes: "Consumer electronics distributor",
      type: "distributor",
      products: ["electronics", "consumer-goods"],
      paymentTerms: "Net 45",
      taxId: "GE456789123",
      rating: 4.2,
      activeContract: false,
    },
  ];

  // Sample Customers
  const sampleCustomers: Customer[] = [
    {
      id: crypto.randomUUID(),
      name: "Acme Corporation",
      email: "purchasing@acmecorp.com",
      phone: "+1-555-1001",
      address: "100 Corporate Plaza, Boston, MA 02101",
      type: "business",
      taxId: "123456789",
      creditLimit: 50000,
      notes: "Large corporate client",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "+1-555-1002",
      address: "456 Residential St, Chicago, IL 60601",
      type: "individual",
      creditLimit: 5000,
      notes: "Regular retail customer",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "StartUp Innovations",
      email: "orders@startupinnovations.com",
      phone: "+1-555-1003",
      address: "789 Startup Lane, Austin, TX 73301",
      type: "business",
      taxId: "987654321",
      creditLimit: 25000,
      notes: "Tech startup, growing client",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
  ];

  // Sample Products
  const sampleProducts: InventoryItem[] = [
    {
      id: crypto.randomUUID(),
      name: "Wireless Bluetooth Headphones",
      description: "Premium noise-canceling wireless headphones with 30-hour battery life",
      category: "Electronics",
      quantity: 45,
      minQuantity: 10,
      cost: 75.00,
      stockMovements: [],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Ergonomic Office Chair",
      description: "Adjustable height office chair with lumbar support and breathable mesh",
      category: "Furniture",
      quantity: 12,
      minQuantity: 5,
      cost: 180.00,
      stockMovements: [],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "4K USB Webcam",
      description: "Ultra HD webcam with auto-focus and built-in microphone",
      category: "Electronics",
      quantity: 28,
      minQuantity: 8,
      cost: 45.00,
      stockMovements: [],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Mechanical Gaming Keyboard",
      description: "RGB backlit mechanical keyboard with blue switches",
      category: "Electronics",
      quantity: 35,
      minQuantity: 12,
      cost: 65.00,
      stockMovements: [],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision optical sensor",
      category: "Electronics",
      quantity: 67,
      minQuantity: 20,
      cost: 18.00,
      stockMovements: [],
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Standing Desk Converter",
      description: "Adjustable height desk converter for standing/sitting workstation",
      category: "Furniture",
      quantity: 8,
      minQuantity: 3,
      cost: 120.00,
      stockMovements: [],
      lastUpdated: new Date().toISOString(),
    },
  ];

  // Add sample data to storage
  sampleVendors.forEach(vendor => storage.addVendor(vendor));
  sampleCustomers.forEach(customer => storage.addCustomer(customer));
  sampleProducts.forEach(product => storage.addInventoryItem(product));

  console.log("Sample data seeded successfully");
};
