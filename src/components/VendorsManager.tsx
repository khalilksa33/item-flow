
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VendorDialog } from "./vendors/VendorDialog";
import { VendorList } from "./vendors/VendorList";
import { useVendors } from "./vendors/useVendors";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function VendorsManager() {
  const { vendors, addVendor, updateVendor, deleteVendor } = useVendors();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const { t, i18n } = useTranslation(["vendors", "common"]);
  const isRTL = i18n.language === 'ar';

  const handleAddVendor = () => {
    setSelectedVendor(null);
    setIsDialogOpen(true);
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("vendors:title")}</h1>
        <Button onClick={handleAddVendor}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("vendors:addVendor")}
        </Button>
      </div>
      
      <p className="text-gray-600 mb-6">{t("vendors:description")}</p>
      
      <VendorList
        vendors={vendors}
        onEdit={handleEditVendor}
        onDelete={deleteVendor}
      />
      
      <VendorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        vendor={selectedVendor}
        onSave={(vendor) => {
          if (selectedVendor) {
            updateVendor(vendor);
          } else {
            addVendor(vendor);
          }
        }}
      />
    </div>
  );
}
