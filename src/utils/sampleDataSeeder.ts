
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
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Office Supplies Pro",
      email: "sales@officesuppliespro.com",
      phone: "+1-555-0202",
      address: "456 Business Blvd, New York, NY 10001",
      notes: "Office furniture and supplies",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Global Electronics",
      email: "info@globalelectronics.com",
      phone: "+1-555-0303",
      address: "789 International Dr, Miami, FL 33101",
      notes: "Consumer electronics distributor",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
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
      customerType: "business",
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
      customerType: "individual",
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
      customerType: "business",
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
      sku: "WBH-001",
      barcode: "1234567890123",
      quantity: 45,
      minStockLevel: 10,
      costPrice: 75.00,
      sellingPrice: 149.99,
      supplier: sampleVendors[0].name,
      location: "A1-B2",
      imageUrl: "",
      notes: "Popular item, fast-moving stock",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Ergonomic Office Chair",
      description: "Adjustable height office chair with lumbar support and breathable mesh",
      category: "Furniture",
      sku: "EOC-002",
      barcode: "2345678901234",
      quantity: 12,
      minStockLevel: 5,
      costPrice: 180.00,
      sellingPrice: 299.99,
      supplier: sampleVendors[1].name,
      location: "C3-D1",
      imageUrl: "",
      notes: "High-quality office furniture",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "4K USB Webcam",
      description: "Ultra HD webcam with auto-focus and built-in microphone",
      category: "Electronics",
      sku: "UHD-003",
      barcode: "3456789012345",
      quantity: 28,
      minStockLevel: 8,
      costPrice: 45.00,
      sellingPrice: 89.99,
      supplier: sampleVendors[2].name,
      location: "A2-C3",
      imageUrl: "",
      notes: "High demand for remote work",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Mechanical Gaming Keyboard",
      description: "RGB backlit mechanical keyboard with blue switches",
      category: "Electronics",
      sku: "MGK-004",
      barcode: "4567890123456",
      quantity: 35,
      minStockLevel: 12,
      costPrice: 65.00,
      sellingPrice: 129.99,
      supplier: sampleVendors[0].name,
      location: "A1-D2",
      imageUrl: "",
      notes: "Gaming accessories category",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with precision optical sensor",
      category: "Electronics",
      sku: "WM-005",
      barcode: "5678901234567",
      quantity: 67,
      minStockLevel: 20,
      costPrice: 18.00,
      sellingPrice: 39.99,
      supplier: sampleVendors[2].name,
      location: "A3-B1",
      imageUrl: "",
      notes: "Best-selling accessory",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
    {
      id: crypto.randomUUID(),
      name: "Standing Desk Converter",
      description: "Adjustable height desk converter for standing/sitting workstation",
      category: "Furniture",
      sku: "SDC-006",
      barcode: "6789012345678",
      quantity: 8,
      minStockLevel: 3,
      costPrice: 120.00,
      sellingPrice: 249.99,
      supplier: sampleVendors[1].name,
      location: "C1-D3",
      imageUrl: "",
      notes: "Ergonomic workplace solutions",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
  ];

  // Add sample data to storage
  sampleVendors.forEach(vendor => storage.addVendor(vendor));
  sampleCustomers.forEach(customer => storage.addCustomer(customer));
  sampleProducts.forEach(product => storage.addInventoryItem(product));

  console.log("Sample data seeded successfully");
};
