
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Receipt,
  TruckIcon,
  Settings
} from "lucide-react";
import { storage } from "@/lib/storage";

const Index = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Inventory', icon: Package, path: '/inventory' },
    { title: 'Customers', icon: Users, path: '/customers' },
    { title: 'Sales', icon: ShoppingCart, path: '/sales' },
    { title: 'Quotations', icon: FileText, path: '/quotations' },
    { title: 'Invoices', icon: Receipt, path: '/invoices' },
    { title: 'Vendors', icon: TruckIcon, path: '/vendors' },
    { title: 'Admin', icon: Settings, path: '/admin' },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Business Management System</h1>
        {!storage.checkActivation() && (
          <p className="text-sm text-red-500 mt-2">
            License expired - Please contact administrator
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card
            key={item.path}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(item.path)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <item.icon className="h-5 w-5" />
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage your {item.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;
