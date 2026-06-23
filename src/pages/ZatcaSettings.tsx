import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, ShieldAlert, Cpu, Settings, FileText } from 'lucide-react';

interface IZatcaSettings {
  vatNumber: string;
  sellerName: string;
  onboarded: boolean;
  environment: 'sandbox' | 'simulation' | 'production';
  invoiceCounter: number;
  lastInvoiceHash?: string;
}

const ZatcaSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<IZatcaSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [vatNumber, setVatNumber] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [otp, setOtp] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'simulation' | 'production'>('sandbox');

  const token = localStorage.getItem('inventory_token');

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/api/zatca/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
      setVatNumber(response.data.vatNumber || '');
      setSellerName(response.data.sellerName || '');
      setEnvironment(response.data.environment || 'sandbox');
    } catch (error: any) {
      toast.error('Failed to load ZATCA settings: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vatNumber || !sellerName || !otp) {
      toast.warning('Please fill in all fields (VAT number, Seller Name, and OTP)');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        '/api/zatca/onboard',
        { vatNumber, sellerName, otp, environment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message || 'Onboarded successfully!');
      setSettings(response.data.settings);
    } catch (error: any) {
      toast.error('Onboarding failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 animate-pulse text-lg">Loading ZATCA configuration...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">ZATCA e-Invoicing Compliance</h1>
          <p className="text-gray-500">Saudi Arabia Tax Authority integration panel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-indigo-500" />
              Device Registration & Onboarding
            </CardTitle>
            <CardDescription>
              Register this ERP system with ZATCA to generate your cryptographic stamp (CSID)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOnboard} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vat">VAT Number (15 digits)</Label>
                  <Input
                    id="vat"
                    placeholder="300000000000003"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seller">Seller Name (English/Arabic)</Label>
                  <Input
                    id="seller"
                    placeholder="Trading Company Name"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Fatoora Portal OTP (6 digits)</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="env">Target Environment</Label>
                  <Select
                    value={environment}
                    onValueChange={(val: any) => setEnvironment(val)}
                  >
                    <SelectTrigger id="env">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Developer Sandbox</SelectItem>
                      <SelectItem value="simulation">Simulation Portal</SelectItem>
                      <SelectItem value="production">Production Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={submitting}>
                {submitting ? 'Registering Device...' : 'Generate Keys & Onboard'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-500" />
              Status Panel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {settings?.onboarded ? (
                <>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="font-semibold text-green-700">Onboarded & Active</span>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  <span className="font-semibold text-red-700">Not Onboarded</span>
                </>
              )}
            </div>

            <div className="border-t pt-2 text-sm space-y-1 text-gray-600">
              <p><span className="font-medium">Active Environment:</span> {settings?.environment?.toUpperCase()}</p>
              <p><span className="font-medium">Invoices Transmitted:</span> {settings?.invoiceCounter}</p>
            </div>

            {settings?.onboarded && (
              <div className="border-t pt-2">
                <p className="text-xs font-semibold text-gray-500">Last Signed Invoice Hash:</p>
                <p className="text-[10px] break-all font-mono bg-gray-100 p-1.5 rounded mt-1">
                  {settings.lastInvoiceHash || 'None'}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/invoices">
                <FileText className="h-4 w-4 mr-2" />
                Go to Invoices
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex gap-4 p-5">
          <ShieldAlert className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-amber-800 text-sm">
            <p className="font-semibold mb-1">ZATCA Phase 2 E-Invoicing Notice</p>
            <p>
              Under Saudi Arabia's ZATCA rules, every invoice printed or emailed must have a valid cryptographic stamp, UBL 2.1 XML structure, and TLV QR Code. Ensure your VAT Number matches your commercial registration. Use the ZATCA Fatoora Portal to generate onboarding OTPs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZatcaSettingsPage;
