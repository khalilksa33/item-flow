
import { Button } from "@/components/ui/button";
import { VendorList } from "./vendors/VendorList";
import { VendorDialog } from "./vendors/VendorDialog";
import { useVendors } from "./vendors/useVendors";

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendors</h2>
        <Button onClick={openAddDialog}>
          Add Vendor
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
