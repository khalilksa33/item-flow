
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Clock } from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function LicenseManagement() {
  const { t } = useTranslation();
  const activationStatus = storage.getActivationStatus();
  const daysRemaining = activationStatus.isPerpetual ? 
    '∞' : 
    Math.ceil((new Date(activationStatus.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handlePerpetualActivation = () => {
    storage.setPerpetualActivation();
    toast.success(t("admin.validLicense"));
  };

  const handleExtendActivation = () => {
    storage.extendActivation(30);
    toast.success(t("admin.licenseExtended", "License extended by 30 days"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          {t("admin.license")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-muted">
          <h3 className="font-semibold mb-2">{t("admin.licenseStatus")}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {activationStatus.isPerpetual ? 
              t("admin.perpetualLicense", "Perpetual License Active") : 
              t("admin.daysRemaining", "{{days}} days remaining", { days: daysRemaining })
            }
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {!activationStatus.isPerpetual && (
            <>
              <Button onClick={handlePerpetualActivation} className="w-full">
                <Key className="h-4 w-4 mr-2" />
                {t("admin.activatePerpetual", "Activate Perpetually")}
              </Button>
              <Button onClick={handleExtendActivation} variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                {t("admin.extendLicense", "Extend by 30 Days")}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
