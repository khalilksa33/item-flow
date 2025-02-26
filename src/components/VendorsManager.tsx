
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VendorDialog } from "./vendors/VendorDialog";
import { VendorList } from "./vendors/VendorList";
import { useVendors } from "./vendors/useVendors";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Vendor } from "@/types/inventory";
import { toast } from "sonner";

export function VendorsManager() {
  const { vendors, isDialogOpen, setIsDialogOpen, editingVendor, formData, setFormData, handleSubmit, handleEdit, handleDelete, openAddDialog } = useVendors();
  const { t, i18n } = useTranslation(["vendors", "common"]);
  const isRTL = i18n.language === 'ar';

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("vendors:title")}</h1>
        <Button onClick={openAddDialog}>
          <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t("vendors:addVendor")}
        </Button>
      </div>
      
      <p className="text-gray-600 mb-6">{t("vendors:description")}</p>
      
      <VendorList
        vendors={vendors}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      <VendorDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        formData={formData}
        editingVendor={editingVendor}
        onFormChange={setFormData}
        onSubmit={handleSubmit}
        onCancel={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
