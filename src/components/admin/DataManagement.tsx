
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Settings, Upload } from "lucide-react";
import { useState } from "react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function DataManagement() {
  const [importing, setImporting] = useState(false);
  const { t } = useTranslation();

  const handleExportData = () => {
    if (!storage.checkActivation()) {
      toast.error(t("inventory.licenseExpired"));
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
    toast.success(t("inventory.exportSuccess"));
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
      
      toast.success(t("inventory.importSuccess"));
    } catch (error) {
      toast.error(t("inventory.importError"));
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t("admin.data")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2">
          <Button onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            {t("admin.backupData")}
          </Button>
          <Button onClick={() => document.getElementById('import-file')?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            {t("admin.restoreData")}
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
