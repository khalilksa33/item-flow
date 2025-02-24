
import { Dashboard } from "@/components/Dashboard";
import { InventoryList } from "@/components/InventoryList";
import { CustomersManager } from "@/components/CustomersManager";
import { VendorsManager } from "@/components/VendorsManager";
import { SalesManager } from "@/components/SalesManager";
import { SalesAnalytics } from "@/components/SalesAnalytics";
import { QuotationsManager } from "@/components/QuotationsManager";
import { InvoicesManager } from "@/components/InvoicesManager";

const Index = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Dashboard />
      <SalesAnalytics />
      <SalesManager />
      <QuotationsManager />
      <InvoicesManager />
      <CustomersManager />
      <VendorsManager />
      <InventoryList />
    </div>
  );
};

export default Index;
