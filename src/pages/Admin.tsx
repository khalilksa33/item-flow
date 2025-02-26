
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { CompanySettings } from "@/components/admin/CompanySettings";
import { RegionalSettings } from "@/components/admin/RegionalSettings";
import { DataManagement } from "@/components/admin/DataManagement";
import { LicenseManagement } from "@/components/admin/LicenseManagement";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const AdminPage = () => {
  const { t, i18n } = useTranslation(["admin", "common"]);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="container mx-auto p-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("common:back")}
          </Button>
        </Link>
        <LanguageSwitcher />
      </div>
      <h1 className="text-3xl font-bold mb-6">{t("admin:title")}</h1>
      <p className="text-gray-600 mb-6">{t("admin:description")}</p>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company">{t("admin:companyTab")}</TabsTrigger>
          <TabsTrigger value="regional">{t("admin:regionalTab")}</TabsTrigger>
          <TabsTrigger value="data">{t("admin:dataTab")}</TabsTrigger>
          <TabsTrigger value="license">{t("admin:licenseTab")}</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <CompanySettings />
        </TabsContent>

        <TabsContent value="regional">
          <RegionalSettings />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement />
        </TabsContent>

        <TabsContent value="license">
          <LicenseManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
