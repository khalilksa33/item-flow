
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Receipt,
  TruckIcon,
  Download,
  Upload,
  Settings
} from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [importing, setImporting] = useState(false);

  const handleExportData = () => {
    if (!storage.checkActivation()) {
      toast.error("Please activate the application to export data");
      return;
    }

    const data = {
      inventory: storage.getItems(),
      customers: storage.getCustomers(),
      vendors: storage.getVendors(),
      sales: storage.getSales(),
      quotations: storage.getQuotations(),
      invoices: storage.getInvoices(),
    };
    
    const csvData = Object.entries(data).map(([key, value]) => 
      `### ${key} ###\n${storage.exportToCSV()}`
    ).join('\n\n');

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-data-export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully as CSV");
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (data.inventory) storage.setItems(data.inventory);
      if (data.customers) storage.setCustomers(data.customers);
      if (data.vendors) storage.setVendors(data.vendors);
      if (data.sales) storage.setSales(data.sales);
      if (data.quotations) storage.setQuotations(data.quotations);
      if (data.invoices) storage.setInvoices(data.invoices);
      
      toast.success("Data imported successfully");
    } catch (error) {
      toast.error("Error importing data. Please check the file format.");
    } finally {
      setImporting(false);
    }
  };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Inventory', icon: Package, path: '/inventory' },
    { title: 'Customers', icon: Users, path: '/customers' },
    { title: 'Sales', icon: ShoppingCart, path: '/sales' },
    { title: 'Quotations', icon: FileText, path: '/quotations' },
    { title: 'Invoices', icon: Receipt, path: '/invoices' },
    { title: 'Vendors', icon: TruckIcon, path: '/vendors' },
    { title: 'Admin', icon: Settings, path: '/admin' },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Management System</h1>
          {!storage.checkActivation() && (
            <p className="text-sm text-red-500 mt-2">
              License expired - Please contact administrator
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImportData}
            disabled={importing}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card
            key={item.path}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your {item.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
