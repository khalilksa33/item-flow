
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function CompanySettings() {
  const [companyName, setCompanyName] = useState(localStorage.getItem('companyName') || '');
  const [vatNumber, setVatNumber] = useState(localStorage.getItem('vatNumber') || '');
  const [crNumber, setCrNumber] = useState(localStorage.getItem('crNumber') || '');
  const [companyAddress, setCompanyAddress] = useState(localStorage.getItem('companyAddress') || '');
  const [companyPhone, setCompanyPhone] = useState(localStorage.getItem('companyPhone') || '');
  const [companyEmail, setCompanyEmail] = useState(localStorage.getItem('companyEmail') || '');

  const saveCompanySettings = () => {
    localStorage.setItem('companyName', companyName);
    localStorage.setItem('vatNumber', vatNumber);
    localStorage.setItem('crNumber', crNumber);
    localStorage.setItem('companyAddress', companyAddress);
    localStorage.setItem('companyPhone', companyPhone);
    localStorage.setItem('companyEmail', companyEmail);
    toast.success("Company settings saved successfully");
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
