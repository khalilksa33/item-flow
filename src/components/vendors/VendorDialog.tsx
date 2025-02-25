
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Vendor } from "@/types/inventory";
import { VendorForm } from "./VendorForm";

interface VendorFormData extends Omit<Vendor, 'id'> {}

interface VendorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: VendorFormData;
  editingVendor: Vendor | null;
  onFormChange: (data: VendorFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function VendorDialog({
  isOpen,
  onOpenChange,
  formData,
  editingVendor,
  onFormChange,
  onSubmit,
  onCancel,
}: VendorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingVendor ? "Edit Vendor" : "Add New Vendor"}
          </DialogTitle>
        </DialogHeader>
        <VendorForm
          formData={formData}
          editingVendor={editingVendor}
          onChange={onFormChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  );
}
