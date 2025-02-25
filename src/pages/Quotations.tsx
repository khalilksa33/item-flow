
import { QuotationsManager } from "@/components/QuotationsManager";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const QuotationsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <Home className="h-4 w-4 mr-2" />
            {t("common.back")}
          </Button>
        </Link>
      </div>
      <QuotationsManager />
    </div>
  );
};

export default QuotationsPage;
