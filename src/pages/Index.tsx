
import { Dashboard } from "@/components/Dashboard";
import { InventoryList } from "@/components/InventoryList";
import { CustomersManager } from "@/components/CustomersManager";
import { VendorsManager } from "@/components/VendorsManager";
import { SalesManager } from "@/components/SalesManager";
import { SalesAnalytics } from "@/components/SalesAnalytics";

const Index = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Dashboard />
      <SalesAnalytics />
      <SalesManager />
      <CustomersManager />
      <VendorsManager />
      <InventoryList />
    </div>
  );
};

export default Index;
