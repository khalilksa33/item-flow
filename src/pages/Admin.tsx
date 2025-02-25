
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Clock } from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

const Admin = () => {
  const activationStatus = storage.getActivationStatus();
  const daysRemaining = activationStatus.isPerpetual ? 
    '∞' : 
    Math.ceil((new Date(activationStatus.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const handlePerpetualActivation = () => {
    storage.setPerpetualActivation();
    toast.success("Application activated perpetually!");
  };

  const handleExtendActivation = () => {
    storage.extendActivation(30);
    toast.success("License extended by 30 days");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>License Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <h3 className="font-semibold mb-2">Current Status</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {activationStatus.isPerpetual ? 
                  "Perpetual License Active" : 
                  `${daysRemaining} days remaining`
                }
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {!activationStatus.isPerpetual && (
                <>
                  <Button onClick={handlePerpetualActivation} className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Activate Perpetually
                  </Button>
                  <Button onClick={handleExtendActivation} variant="outline" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Extend by 30 Days
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
