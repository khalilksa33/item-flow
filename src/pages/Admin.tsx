
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Key, 
  Clock, 
  Download, 
  Upload, 
  Home,
  Globe,
  Building,
  Settings
} from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Admin = () => {
  const [importing, setImporting] = useState(false);
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName') || '');
  const [timezone, setTimezone] = useState(localStorage.getItem('timezone') || 'UTC');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');

  const activationStatus = storage.getActivationStatus();
  const daysRemaining = activationStatus.isPerpetual ? 
    '∞' : 
    Math.ceil((new Date(activationStatus.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handlePerpetualActivation = () => {
    storage.setPerpetualActivation();
    toast.success("Application activated perpetually!");
  };

  const handleExtendActivation = () => {
    storage.extendActivation(30);
    toast.success("License extended by 30 days");
  };

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

  const saveSettings = () => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('timezone', timezone);
    localStorage.setItem('currency', currency);
    toast.success("Settings saved successfully");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              License Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <h3 className="font-semibold mb-2">Current Status</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {activationStatus.isPerpetual ? 
                  "Perpetual License Active" : 
                  `${daysRemaining} days remaining`
                }
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {!activationStatus.isPerpetual && (
                <>
                  <Button onClick={handlePerpetualActivation} className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Activate Perpetually
                  </Button>
                  <Button onClick={handleExtendActivation} variant="outline" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Extend by 30 Days
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Company Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input 
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
              />
            </div>
            <Button onClick={saveSettings}>Save Company Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Regional Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input 
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="UTC"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input 
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="USD"
              />
            </div>
            <Button onClick={saveSettings}>Save Regional Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
