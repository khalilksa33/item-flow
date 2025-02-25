
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function RegionalSettings() {
  const { t } = useTranslation();
  const [timezone, setTimezone] = useState(localStorage.getItem('timezone') || 'UTC');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [vatRate, setVatRate] = useState(localStorage.getItem('vatRate') || '15');
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'DD/MM/YYYY');

  const saveRegionalSettings = () => {
    localStorage.setItem('timezone', timezone);
    localStorage.setItem('currency', currency);
    localStorage.setItem('vatRate', vatRate);
    localStorage.setItem('dateFormat', dateFormat);
    toast.success(t("admin.settingsSaved", "Regional settings saved successfully"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t("admin.regional")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">{t("admin.timeZone")}</Label>
          <Input 
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="UTC"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">{t("admin.currency")}</Label>
          <Input 
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="USD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vatRate">{t("admin.vatRate", "VAT Rate (%)")}</Label>
          <Input 
            id="vatRate"
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            placeholder="15"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateFormat">{t("admin.dateFormat")}</Label>
          <Input 
            id="dateFormat"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            placeholder="DD/MM/YYYY"
          />
        </div>
        <Button onClick={saveRegionalSettings}>{t("common.save")} {t("admin.settings")}</Button>
      </CardContent>
    </Card>
  );
}
