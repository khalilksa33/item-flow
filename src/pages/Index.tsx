
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  BoxIcon,
  BarChart as BarChartIcon,
  Users as UsersIcon,
  ShoppingCart as ShoppingCartIcon,
  FileText as FileTextIcon,
  Truck as TruckIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
} from "lucide-react";
import { storage } from "@/lib/storage";
import { useUser } from "@/contexts/UserContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Index = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isAdmin } = useUser();
  const { t, i18n } = useTranslation(["dashboard", "inventory", "customers", "sales", "quotations", "invoices", "vendors", "admin", "app", "common"]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Initialize data on first load
    storage.initializeData();
    
    // Check localStorage directly for user info
    const userJson = localStorage.getItem('inventory_current_user');
    if (userJson) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, [currentUser]);

  const checkActivation = () => {
    return storage.checkActivation();
  };

  const menuItems = [
    {
      title: t("dashboard:title"),
      icon: <BarChartIcon className="h-5 w-5" />,
      description: t("dashboard:description"),
      href: "/dashboard",
      color: "bg-blue-500",
    },
    {
      title: t("inventory:title"),
      icon: <BoxIcon className="h-5 w-5" />,
      description: t("inventory:description"),
      href: "/inventory",
      color: "bg-green-500",
    },
    {
      title: t("customers:title"),
      icon: <UsersIcon className="h-5 w-5" />,
      description: t("customers:description"),
      href: "/customers",
      color: "bg-purple-500",
    },
    {
      title: t("sales:title"),
      icon: <ShoppingCartIcon className="h-5 w-5" />,
      description: t("sales:description"),
      href: "/sales",
      color: "bg-yellow-500",
    },
    {
      title: t("quotations:title"),
      icon: <FileTextIcon className="h-5 w-5" />,
      description: t("quotations:description"),
      href: "/quotations",
      color: "bg-orange-500",
    },
    {
      title: t("invoices:title"),
      icon: <FileTextIcon className="h-5 w-5" />,
      description: t("invoices:description"),
      href: "/invoices",
      color: "bg-red-500",
    },
    {
      title: t("vendors:title"),
      icon: <TruckIcon className="h-5 w-5" />,
      description: t("vendors:description"),
      href: "/vendors",
      color: "bg-teal-500",
    },
  ];
  
  // Only show admin card if user is an admin
  const adminCard = isAdmin() ? [
    {
      title: t("admin:title"),
      icon: <SettingsIcon className="h-5 w-5" />,
      description: t("admin:description"),
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

  // Try to get user from localStorage if currentUser is null
  const getUserInfo = () => {
    if (currentUser) return currentUser;
    
    const userJson = localStorage.getItem('inventory_current_user');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        console.error("Failed to parse user data:", e);
      }
    }
    return null;
  };

  const user = getUserInfo();

  return (
    <div className="container mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
      <header className="mb-6 flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className="text-3xl font-bold">{t("app:title")}</h1>
          <p className="text-gray-500">{t("app:subtitle")}</p>
        </div>
        <div>
          <LanguageSwitcher />
        </div>
      </header>

      {!user && !userLoggedIn ? (
        <div className="text-center mt-10">
          <h2 className="text-2xl font-semibold mb-4">{t("app:welcome")}</h2>
          <p className="text-gray-600 mb-6">{t("app:pleaseLogin")}</p>
          <Button asChild size="lg">
            <Link to="/login">{t("auth:login")}</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">{t("common:welcome")}, {user?.username}</h2>
              <p className="text-sm text-gray-500">{t("common:role")}: {user?.role}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOutIcon className="h-4 w-4 mr-2" />
              {t("auth:logout")}
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
                    <Link to={item.href}>{t("common:view")} {item.title}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      <footer className="mt-12 text-center text-sm text-gray-500">
        <p>{t("app:footer.copyright")} &copy; {new Date().getFullYear()}</p>
        <p>
          {t("app:footer.licenseStatus")}:{" "}
          <span className={checkActivation() ? "text-green-500" : "text-red-500"}>
            {checkActivation() ? t("app:footer.active") : t("app:footer.inactive")}
          </span>
        </p>
        <p className="mt-2">Developed by <a href="https://kamysoft.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">KamySoft.com</a></p>
      </footer>
    </div>
  );
};

export default Index;
