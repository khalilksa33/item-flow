
import { useState } from "react";
import { storage } from "@/lib/storage";
import { Vendor } from "@/types/inventory";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface VendorFormData extends Omit<Vendor, 'id'> {}

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>(storage.getVendors());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<VendorFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    type: 'manufacturer',
    products: [],
    paymentTerms: '',
    taxId: '',
    rating: 0,
    activeContract: false,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      type: 'manufacturer',
      products: [],
      paymentTerms: '',
      taxId: '',
      rating: 0,
      activeContract: false,
    });
    setEditingVendor(null);
  };

  const loadVendors = () => {
    setVendors(storage.getVendors());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vendorData: Vendor = {
      id: editingVendor?.id || crypto.randomUUID(),
      ...formData,
      products: formData.products || [],
    };

    if (editingVendor) {
      storage.updateVendor(vendorData);
      toast.success(t("vendors.vendorUpdated"));
    } else {
      storage.addVendor(vendorData);
      toast.success(t("vendors.vendorAdded"));
    }

    loadVendors();
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      address: vendor.address,
      notes: vendor.notes || '',
      type: vendor.type,
      products: vendor.products,
      paymentTerms: vendor.paymentTerms,
      taxId: vendor.taxId,
      rating: vendor.rating || 0,
      activeContract: vendor.activeContract || false,
      lastOrderDate: vendor.lastOrderDate,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    storage.deleteVendor(id);
    loadVendors();
    toast.success(t("vendors.vendorDeleted"));
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return {
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
  };
}
