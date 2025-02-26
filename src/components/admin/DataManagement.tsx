
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Settings, Upload } from "lucide-react";
import { useState } from "react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function DataManagement() {
  const [importing, setImporting] = useState(false);
  const { t } = useTranslation("admin");

  const handleExportData = () => {
    if (!storage.checkActivation()) {
      toast.error(t("inventory:licenseExpired"));
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
    
    // Export as JSON
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business-data-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(t("inventory:exportSuccess"));
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate data structure before importing
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }
      
      // Import data with validation
      if (data.inventory && Array.isArray(data.inventory)) {
        storage.setItems(data.inventory);
      }
      
      if (data.customers && Array.isArray(data.customers)) {
        storage.setCustomers(data.customers);
      }
      
      if (data.vendors && Array.isArray(data.vendors)) {
        storage.setVendors(data.vendors);
      }
      
      if (data.sales && Array.isArray(data.sales)) {
        storage.setSales(data.sales);
      }
      
      if (data.quotations && Array.isArray(data.quotations)) {
        storage.setQuotations(data.quotations);
      }
      
      if (data.invoices && Array.isArray(data.invoices)) {
        storage.setInvoices(data.invoices);
      }
      
      toast.success(t("inventory:importSuccess"));
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast.error(t("inventory:importError"));
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t("data")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            {t("backupData")}
          </Button>
          <Button onClick={() => document.getElementById('import-file')?.click()} disabled={importing}>
            <Upload className="h-4 w-4 mr-2" />
            {importing ? t("common:loading", "Loading...") : t("restoreData")}
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
  );
}
