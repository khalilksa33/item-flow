import { useState, useEffect } from 'react';
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
  Settings,
  Lock
} from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [importing, setImporting] = useState(false);
  
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName') || '');
  const [vatNumber, setVatNumber] = useState(localStorage.getItem('vatNumber') || '');
  const [crNumber, setCrNumber] = useState(localStorage.getItem('crNumber') || '');
  const [companyAddress, setCompanyAddress] = useState(localStorage.getItem('companyAddress') || '');
  const [companyPhone, setCompanyPhone] = useState(localStorage.getItem('companyPhone') || '');
  const [companyEmail, setCompanyEmail] = useState(localStorage.getItem('companyEmail') || '');
  
  const [timezone, setTimezone] = useState(localStorage.getItem('timezone') || 'UTC');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [vatRate, setVatRate] = useState(localStorage.getItem('vatRate') || '15');
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'DD/MM/YYYY');

  const activationStatus = storage.getActivationStatus();
  const daysRemaining = activationStatus.isPerpetual ? 
    '∞' : 
    Math.ceil((new Date(activationStatus.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

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

  const saveCompanySettings = () => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('vatNumber', vatNumber);
    localStorage.setItem('crNumber', crNumber);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('companyPhone', companyPhone);
    localStorage.setItem('companyEmail', companyEmail);
    toast.success("Company settings saved successfully");
  };

  const saveRegionalSettings = () => {
    localStorage.setItem('timezone', timezone);
    localStorage.setItem('currency', currency);
    localStorage.setItem('vatRate', vatRate);
    localStorage.setItem('dateFormat', dateFormat);
    toast.success("Regional settings saved successfully");
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
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
            <div className="space-y-2">
              <Label htmlFor="vatNumber">VAT Number</Label>
              <Input 
                id="vatNumber"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="Enter VAT number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="crNumber">CR Number</Label>
              <Input 
                id="crNumber"
                value={crNumber}
                onChange={(e) => setCrNumber(e.target.value)}
                placeholder="Enter CR number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyAddress">Company Address</Label>
              <Input 
                id="companyAddress"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Enter company address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyPhone">Phone Number</Label>
              <Input 
                id="companyPhone"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email Address</Label>
              <Input 
                id="companyEmail"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            <Button onClick={saveCompanySettings}>Save Company Settings</Button>
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
            <div className="space-y-2">
              <Label htmlFor="vatRate">VAT Rate (%)</Label>
              <Input 
                id="vatRate"
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                placeholder="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFormat">Date Format</Label>
              <Input 
                id="dateFormat"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <Button onClick={saveRegionalSettings}>Save Regional Settings</Button>
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
