
import { Dashboard as DashboardComponent } from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardComponent />
    </div>
  );
};

export default DashboardPage;
