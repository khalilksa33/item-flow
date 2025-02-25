
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { LicenseManagement } from "@/components/admin/LicenseManagement";
import { CompanySettings } from "@/components/admin/CompanySettings";
import { RegionalSettings } from "@/components/admin/RegionalSettings";
import { DataManagement } from "@/components/admin/DataManagement";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { currentUser, isAdmin } = useUser();
  const { t } = useTranslation();

  // Check both localStorage adminAuth and user role for admin authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true' || (currentUser && currentUser.role === 'admin')) {
      setIsAuthenticated(true);
      // Ensure adminAuth is set in localStorage for persistence
      localStorage.setItem('adminAuth', 'true');
    }
  }, [currentUser]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  // If not admin user and not already authenticated via adminAuth, show login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{t("admin.title")}</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>{t("auth.logout")}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LicenseManagement />
        <CompanySettings />
        <RegionalSettings />
        <DataManagement />
      </div>
    </div>
  );
};

export default Admin;
