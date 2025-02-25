
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";

export function CompanySettings() {
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName') || '');
  const [vatNumber, setVatNumber] = useState(localStorage.getItem('vatNumber') || '');
  const [crNumber, setCrNumber] = useState(localStorage.getItem('crNumber') || '');
  const [companyAddress, setCompanyAddress] = useState(localStorage.getItem('companyAddress') || '');
  const [companyPhone, setCompanyPhone] = useState(localStorage.getItem('companyPhone') || '');
  const [companyEmail, setCompanyEmail] = useState(localStorage.getItem('companyEmail') || '');
  const [companyLogo, setCompanyLogo] = useState(localStorage.getItem('companyLogo') || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveCompanySettings = () => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('vatNumber', vatNumber);
    localStorage.setItem('crNumber', crNumber);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('companyPhone', companyPhone);
    localStorage.setItem('companyEmail', companyEmail);
    localStorage.setItem('companyLogo', companyLogo);
    toast.success("Company settings saved successfully");
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Logo file size must be less than 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCompanyLogo(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCompanyLogo('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success("Company logo removed");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Company Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input 
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyLogo">Company Logo</Label>
          <div className="flex flex-col gap-2">
            <Input 
              ref={fileInputRef}
              id="companyLogo"
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            {companyLogo && (
              <div className="mt-2 space-y-2">
                <div className="border rounded p-4 flex justify-center">
                  <img 
                    src={companyLogo} 
                    alt="Company Logo" 
                    className="max-h-32 max-w-full object-contain" 
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRemoveLogo}
                  className="w-full"
                >
                  Remove Logo
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vatNumber">VAT Number</Label>
          <Input 
            id="vatNumber"
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            placeholder="Enter VAT number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="crNumber">CR Number</Label>
          <Input 
            id="crNumber"
            value={crNumber}
            onChange={(e) => setCrNumber(e.target.value)}
            placeholder="Enter CR number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyAddress">Company Address</Label>
          <Input 
            id="companyAddress"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            placeholder="Enter company address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyPhone">Phone Number</Label>
          <Input 
            id="companyPhone"
            value={companyPhone}
            onChange={(e) => setCompanyPhone(e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="companyEmail">Email Address</Label>
          <Input 
            id="companyEmail"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <Button onClick={saveCompanySettings}>Save Company Settings</Button>
      </CardContent>
    </Card>
  );
}
