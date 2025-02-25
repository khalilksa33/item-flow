
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  BoxIcon,
  BarChartIcon,
  UsersIcon,
  ShoppingCartIcon,
  FileTextIcon,
  TruckIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";
import { storage } from "@/lib/storage";
import { useUser } from "@/contexts/UserContext";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useUser();

  useEffect(() => {
    // Initialize data on first load
    storage.initializeData();
  }, []);

  const checkActivation = () => {
    return storage.checkActivation();
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <BarChartIcon className="h-5 w-5" />,
      description: "View analytics and business overview",
      href: "/dashboard",
      color: "bg-blue-500",
    },
    {
      title: "Inventory",
      icon: <BoxIcon className="h-5 w-5" />,
      description: "Manage your inventory items",
      href: "/inventory",
      color: "bg-green-500",
    },
    {
      title: "Customers",
      icon: <UsersIcon className="h-5 w-5" />,
      description: "Manage customer information",
      href: "/customers",
      color: "bg-purple-500",
    },
    {
      title: "Sales",
      icon: <ShoppingCartIcon className="h-5 w-5" />,
      description: "Track and manage sales",
      href: "/sales",
      color: "bg-yellow-500",
    },
    {
      title: "Quotations",
      icon: <FileTextIcon className="h-5 w-5" />,
      description: "Create and manage quotations",
      href: "/quotations",
      color: "bg-orange-500",
    },
    {
      title: "Invoices",
      icon: <FileTextIcon className="h-5 w-5" />,
      description: "Generate and track invoices",
      href: "/invoices",
      color: "bg-red-500",
    },
    {
      title: "Vendors",
      icon: <TruckIcon className="h-5 w-5" />,
      description: "Manage your vendors and suppliers",
      href: "/vendors",
      color: "bg-teal-500",
    },
  ];
  
  // Only show admin card if user is an admin
  const adminCard = isAdmin() ? [
    {
      title: "Admin Settings",
      icon: <SettingsIcon className="h-5 w-5" />,
      description: "Configure system settings and permissions",
      href: "/admin",
      color: "bg-gray-700",
    }
  ] : [];

  // Combine regular menu items with admin card (if applicable)
  const allMenuItems = [...menuItems, ...adminCard];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Inventory Management System</h1>
        <p className="text-gray-500">Manage your inventory, customers, and sales efficiently</p>
      </header>

      {!currentUser ? (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold mb-4">Welcome to the Inventory Management System</h2>
          <p className="text-gray-600 mb-6">Please log in to access the system features</p>
          <Button asChild size="lg">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Welcome, {currentUser.username}</h2>
              <p className="text-sm text-gray-500">Role: {currentUser.role}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allMenuItems.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <div className={`h-2 ${item.color}`} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${item.color} text-white`}>
                      {item.icon}
                    </div>
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link to={item.href}>Access {item.title}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>Inventory Management System &copy; {new Date().getFullYear()}</p>
        <p>
          License Status:{" "}
          <span className={checkActivation() ? "text-green-500" : "text-red-500"}>
            {checkActivation() ? "Active" : "Inactive"}
          </span>
        </p>
      </footer>
    </div>
  );
};

export default Index;
