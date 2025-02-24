
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { storage } from "@/lib/storage";
import { Vendor } from "@/types/inventory";
import { toast } from "sonner";

interface VendorFormData extends Omit<Vendor, 'id'> {}

export function VendorsManager() {
  const [vendors, setVendors] = useState<Vendor[]>(storage.getVendors());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
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
      toast.success("Vendor updated successfully");
    } else {
      storage.addVendor(vendorData);
      toast.success("Vendor added successfully");
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
    toast.success("Vendor deleted successfully");
  };

  const handleProductsChange = (value: string) => {
    const productsList = value.split(',').map(p => p.trim()).filter(p => p);
    setFormData({ ...formData, products: productsList });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Vendors</h2>
        <Button onClick={() => {
          resetForm();
          setIsDialogOpen(true);
        }}>
          Add Vendor
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.map((vendor) => (
            <TableRow key={vendor.id}>
              <TableCell>{vendor.name}</TableCell>
              <TableCell className="capitalize">{vendor.type}</TableCell>
              <TableCell>{vendor.products.join(', ')}</TableCell>
              <TableCell>{vendor.email}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${vendor.activeContract ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {vendor.activeContract ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(vendor)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(vendor.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? "Edit Vendor" : "Add New Vendor"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'manufacturer' | 'wholesaler' | 'distributor' })}
                  required
                >
                  <option value="manufacturer">Manufacturer</option>
                  <option value="wholesaler">Wholesaler</option>
                  <option value="distributor">Distributor</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Input
                  id="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  required
                  placeholder="e.g., Net 30"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="products">Products (comma-separated)</Label>
                <Input
                  id="products"
                  value={formData.products.join(', ')}
                  onChange={(e) => handleProductsChange(e.target.value)}
                  placeholder="e.g., Electronics, Components, Accessories"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.activeContract}
                    onChange={(e) => setFormData({ ...formData, activeContract: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  Active Contract
                </Label>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingVendor ? "Update" : "Add"} Vendor
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
