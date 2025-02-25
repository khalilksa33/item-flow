
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function RegionalSettings() {
  const [timezone, setTimezone] = useState(localStorage.getItem('timezone') || 'UTC');
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'USD');
  const [vatRate, setVatRate] = useState(localStorage.getItem('vatRate') || '15');
  const [dateFormat, setDateFormat] = useState(localStorage.getItem('dateFormat') || 'DD/MM/YYYY');

  const saveRegionalSettings = () => {
    localStorage.setItem('timezone', timezone);
    localStorage.setItem('currency', currency);
    localStorage.setItem('vatRate', vatRate);
    localStorage.setItem('dateFormat', dateFormat);
    toast.success("Regional settings saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Regional Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input 
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="UTC"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input 
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="USD"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vatRate">VAT Rate (%)</Label>
          <Input 
            id="vatRate"
            type="number"
            value={vatRate}
            onChange={(e) => setVatRate(e.target.value)}
            placeholder="15"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateFormat">Date Format</Label>
          <Input 
            id="dateFormat"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            placeholder="DD/MM/YYYY"
          />
        </div>
        <Button onClick={saveRegionalSettings}>Save Regional Settings</Button>
      </CardContent>
    </Card>
  );
}
