
import { Button } from "@/components/ui/button";
import { VendorList } from "./vendors/VendorList";
import { VendorDialog } from "./vendors/VendorDialog";
import { useVendors } from "./vendors/useVendors";
import { useTranslation } from "react-i18next";

export function VendorsManager() {
  const {
    vendors,
    isDialogOpen,
    setIsDialogOpen,
    editingVendor,
    formData,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    openAddDialog,
  } = useVendors();
  
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("vendors.title")}</h2>
        <Button onClick={openAddDialog}>
          {t("vendors.addVendor")}
        </Button>
      </div>

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
