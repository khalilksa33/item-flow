
import { QuotationsManager } from "@/components/quotations/QuotationsManager";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

const QuotationsPage = () => {
  const { t, i18n } = useTranslation(["quotations", "common"]);
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
      <h1 className="text-3xl font-bold mb-6">{t("quotations:title")}</h1>
      <p className="text-gray-600 mb-6">{t("quotations:description")}</p>
      <QuotationsManager />
    </div>
  );
};

export default QuotationsPage;
