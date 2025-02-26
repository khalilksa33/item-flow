
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function RegionalSettings() {
  const { t, i18n } = useTranslation(["admin", "common"]);
  const isRTL = i18n.language === 'ar';
  const [timezone, setTimezone] = useState(localStorage.getItem('timezone') || 'UTC');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [vatRate, setVatRate] = useState(localStorage.getItem('vatRate') || '15');
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'DD/MM/YYYY');

  const saveRegionalSettings = () => {
    localStorage.setItem('timezone', timezone);
    localStorage.setItem('currency', currency);
    localStorage.setItem('vatRate', vatRate);
    localStorage.setItem('dateFormat', dateFormat);
    toast.success(t("admin:settingsSaved"));
  };

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t("admin:regional")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timezone" className={isRTL ? "text-right block" : "text-left block"}>
            {t("admin:timeZone")}
          </Label>
          <Input 
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="UTC"
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency" className={isRTL ? "text-right block" : "text-left block"}>
            {t("admin:currency")}
          </Label>
          <Input 
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="USD"
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vatRate" className={isRTL ? "text-right block" : "text-left block"}>
            {t("admin:vatRate")}
          </Label>
          <Input 
            id="vatRate"
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            placeholder="15"
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateFormat" className={isRTL ? "text-right block" : "text-left block"}>
            {t("admin:dateFormat")}
          </Label>
          <Input 
            id="dateFormat"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            placeholder="DD/MM/YYYY"
            className={isRTL ? "text-right" : "text-left"}
          />
        </div>
        <Button onClick={saveRegionalSettings}>
          {t("common:save")} {t("admin:settings")}
        </Button>
      </CardContent>
    </Card>
  );
}
