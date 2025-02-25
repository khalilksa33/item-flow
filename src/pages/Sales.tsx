
import { SalesManager } from "@/components/SalesManager";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const SalesPage = () => {
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
      <SalesManager />
    </div>
  );
};

export default SalesPage;
