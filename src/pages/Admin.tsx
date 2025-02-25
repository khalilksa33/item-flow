
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CompanySettings } from "@/components/admin/CompanySettings";
import { UserManager } from "@/components/UserManager";
import { DataManagement } from "@/components/admin/DataManagement";
import { LicenseManagement } from "@/components/admin/LicenseManagement";
import { RegionalSettings } from "@/components/admin/RegionalSettings";
import { AuditLog } from "@/components/AuditLog";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const AdminPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("users");

  // Get the tab from URL if present
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ["users", "company", "data", "license", "regional", "audit"].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <Home className="h-4 w-4 mr-2" />
              {t("common.back")}
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-6">{t("admin.title")}</h1>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-6">
            <TabsTrigger value="users">{t("admin.users")}</TabsTrigger>
            <TabsTrigger value="company">{t("admin.company")}</TabsTrigger>
            <TabsTrigger value="data">{t("admin.data")}</TabsTrigger>
            <TabsTrigger value="license">{t("admin.license")}</TabsTrigger>
            <TabsTrigger value="regional">{t("admin.regional")}</TabsTrigger>
            <TabsTrigger value="audit">{t("admin.audit")}</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManager standalone={true} />
          </TabsContent>
          <TabsContent value="company">
            <CompanySettings />
          </TabsContent>
          <TabsContent value="data">
            <DataManagement />
          </TabsContent>
          <TabsContent value="license">
            <LicenseManagement />
          </TabsContent>
          <TabsContent value="regional">
            <RegionalSettings />
          </TabsContent>
          <TabsContent value="audit">
            <AuditLog />
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
