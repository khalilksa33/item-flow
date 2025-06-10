
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function CompanySettings() {
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [crNumber, setCrNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const { t, i18n } = useTranslation(["admin", "common"]);
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Load stored values or set default logo
    setCompanyName(localStorage.getItem("companyName") || "");
    setVatNumber(localStorage.getItem("vatNumber") || "");
    setCrNumber(localStorage.getItem("crNumber") || "");
    setCompanyAddress(localStorage.getItem("companyAddress") || "");
    setCompanyPhone(localStorage.getItem("companyPhone") || "");
    setCompanyEmail(localStorage.getItem("companyEmail") || "");
    
    // Set default logo if none exists
    const storedLogo = localStorage.getItem("companyLogo");
    if (!storedLogo) {
      const defaultLogo = "/lovable-uploads/e4256b8e-7ddc-4472-924e-c213f46c6ea2.png";
      setCompanyLogo(defaultLogo);
      localStorage.setItem("companyLogo", defaultLogo);
    } else {
      setCompanyLogo(storedLogo);
    }
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCompanyLogo(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const useDefaultLogo = () => {
    const defaultLogo = "/lovable-uploads/e4256b8e-7ddc-4472-924e-c213f46c6ea2.png";
    setCompanyLogo(defaultLogo);
    toast.success("Default logo applied");
  };

  const saveSettings = () => {
    localStorage.setItem("companyName", companyName);
    localStorage.setItem("vatNumber", vatNumber);
    localStorage.setItem("crNumber", crNumber);
    localStorage.setItem("companyAddress", companyAddress);
    localStorage.setItem("companyPhone", companyPhone);
    localStorage.setItem("companyEmail", companyEmail);
    localStorage.setItem("companyLogo", companyLogo);
    toast.success(t("admin:settingsSaved"));
  };

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {t("admin:companyInfo")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName" className={isRTL ? "text-right block" : "block"}>
            {t("admin:companyName")}
          </Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={isRTL ? "text-right" : ""}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vatNumber" className={isRTL ? "text-right block" : "block"}>
              {t("admin:vatNumber")}
            </Label>
            <Input
              id="vatNumber"
              value={vatNumber}
              onChange={(e) => setVatNumber(e.target.value)}
              className={isRTL ? "text-right" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="crNumber" className={isRTL ? "text-right block" : "block"}>
              {t("admin:crNumber")}
            </Label>
            <Input
              id="crNumber"
              value={crNumber}
              onChange={(e) => setCrNumber(e.target.value)}
              className={isRTL ? "text-right" : ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress" className={isRTL ? "text-right block" : "block"}>
            {t("admin:companyAddress")}
          </Label>
          <Input
            id="companyAddress"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            className={isRTL ? "text-right" : ""}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyPhone" className={isRTL ? "text-right block" : "block"}>
              {t("admin:companyPhone")}
            </Label>
            <Input
              id="companyPhone"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              className={isRTL ? "text-right" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyEmail" className={isRTL ? "text-right block" : "block"}>
              {t("admin:companyEmail")}
            </Label>
            <Input
              id="companyEmail"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              className={isRTL ? "text-right" : ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyLogo" className={isRTL ? "text-right block" : "block"}>
            {t("admin:companyLogo")}
          </Label>
          <div className="flex gap-2">
            <Input
              id="companyLogo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className={`flex-1 ${isRTL ? "text-right" : ""}`}
            />
            <Button type="button" variant="outline" onClick={useDefaultLogo}>
              Use Default
            </Button>
          </div>
          {companyLogo && (
            <div className="mt-2">
              <p className={isRTL ? "text-right" : ""}>{t("admin:currentLogo")}:</p>
              <img
                src={companyLogo}
                alt="Company Logo"
                className="mt-2 max-h-20 object-contain"
              />
            </div>
          )}
        </div>

        <Button onClick={saveSettings}>
          {t("common:save")} {t("admin:settings")}
        </Button>
      </CardContent>
    </Card>
  );
}
