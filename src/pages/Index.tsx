
import { Dashboard } from "@/components/Dashboard";
import { InventoryList } from "@/components/InventoryList";
import { CustomersManager } from "@/components/CustomersManager";

const Index = () => {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Dashboard />
      <CustomersManager />
      <InventoryList />
    </div>
  );
};

export default Index;
