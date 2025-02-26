
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function LicenseManagement() {
  const [licenseKey, setLicenseKey] = useState(localStorage.getItem('licenseKey') || '');
  const [licenseStatus] = useState(localStorage.getItem('licenseStatus') || 'inactive');
  const { t, i18n } = useTranslation(["admin", "common"]);
  const isRTL = i18n.language === 'ar';

  const activateLicense = () => {
    // In a real app, you'd validate with a backend service
    if (licenseKey.length > 8) {
      localStorage.setItem('licenseKey', licenseKey);
      localStorage.setItem('licenseStatus', 'active');
      toast.success(t("admin:licenseActivated"));
      // Force refresh to update the status display
      window.location.reload();
    } else {
      toast.error(t("admin:invalidLicense"));
    }
  };

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          {t("admin:licenseTab")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-md bg-gray-100">
          <div className="flex items-center justify-between">
            <span className="font-medium">{t("admin:licenseStatus")}:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                licenseStatus === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {licenseStatus === 'active' ? t("admin:licenseValid") : t("admin:licenseInvalid")}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseKey" className={isRTL ? "text-right block" : "block"}>
            {t("admin:licenseKey")}
          </Label>
          <Input
            id="licenseKey"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder={t("admin:enterLicenseKey")}
            className={isRTL ? "text-right" : ""}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={activateLicense}>
            {t("admin:activateLicense")}
          </Button>
          <Button variant="outline" onClick={() => {
            window.open('https://example.com/purchase', '_blank');
          }}>
            {t("admin:purchaseLicense")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
