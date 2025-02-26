
import { InvoicesManager } from "@/components/InvoicesManager";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const InvoicesPage = () => {
  const { t, i18n } = useTranslation(["common", "invoices"]);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t("back")}
          </Button>
        </Link>
      </div>
      <InvoicesManager />
    </div>
  );
};

export default InvoicesPage;
