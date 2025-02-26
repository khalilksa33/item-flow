
import { InvoicesManager } from "@/components/InvoicesManager";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const InvoicesPage = () => {
  const { t, i18n } = useTranslation(["common", "invoices"]);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("common:back")}
          </Button>
        </Link>
        <LanguageSwitcher />
      </div>
      <InvoicesManager />
    </div>
  );
};

export default InvoicesPage;
