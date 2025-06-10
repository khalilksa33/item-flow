
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function LicenseManagement() {
  const [licenseKey, setLicenseKey] = useState(localStorage.getItem('licenseKey') || '');
  const [licenseStatus, setLicenseStatus] = useState(localStorage.getItem('licenseStatus') || 'inactive');
  const { t, i18n } = useTranslation(["admin", "common"]);
  const isRTL = i18n.language === 'ar';

  const activateLicense = () => {
    // Enhanced validation
    if (licenseKey.length >= 12) {
      localStorage.setItem('licenseKey', licenseKey);
      localStorage.setItem('licenseStatus', 'active');
      setLicenseStatus('active');
      toast.success(t("admin:licenseActivated"));
    } else {
      toast.error(t("admin:invalidLicense"));
    }
  };

  const deactivateLicense = () => {
    localStorage.setItem('licenseStatus', 'inactive');
    setLicenseStatus('inactive');
    toast.success("License deactivated successfully");
  };

  const clearLicense = () => {
    localStorage.removeItem('licenseKey');
    localStorage.removeItem('licenseStatus');
    setLicenseKey('');
    setLicenseStatus('inactive');
    toast.success("License data cleared");
  };

  const generateTrialLicense = () => {
    const trialKey = `TRIAL-${Date.now().toString().slice(-8)}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setLicenseKey(trialKey);
    localStorage.setItem('licenseKey', trialKey);
    localStorage.setItem('licenseStatus', 'trial');
    setLicenseStatus('trial');
    toast.success("30-day trial license generated");
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
            <div className="flex items-center gap-2">
              {licenseStatus === 'active' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : licenseStatus === 'trial' ? (
                <CheckCircle className="h-4 w-4 text-orange-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  licenseStatus === 'active'
                    ? 'bg-green-100 text-green-800'
                    : licenseStatus === 'trial'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {licenseStatus === 'active' ? t("admin:licenseValid") : 
                 licenseStatus === 'trial' ? 'Trial Active' :
                 t("admin:licenseInvalid")}
              </span>
            </div>
          </div>
          {licenseKey && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Key:</span> {licenseKey.slice(0, 8)}...
            </div>
          )}
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
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={activateLicense} disabled={!licenseKey}>
            {t("admin:activateLicense")}
          </Button>
          
          <Button variant="outline" onClick={generateTrialLicense}>
            Generate Trial
          </Button>
          
          {licenseStatus === 'active' && (
            <Button variant="outline" onClick={deactivateLicense}>
              Deactivate
            </Button>
          )}
          
          <Button variant="destructive" onClick={clearLicense} size="sm">
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          
          <Button variant="outline" onClick={() => {
            window.open('https://dynapulsar.com/purchase', '_blank');
          }}>
            {t("admin:purchaseLicense")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
