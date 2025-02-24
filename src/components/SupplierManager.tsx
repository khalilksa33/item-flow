
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/lib/storage";
import { Supplier } from "@/types/inventory";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface SupplierManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SupplierManager({ isOpen, onClose }: SupplierManagerProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>();
  const [formData, setFormData] = useState<Partial<Supplier>>({});

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = () => {
    setSuppliers(storage.getSuppliers());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplierData: Supplier = {
      id: editingSupplier?.id || crypto.randomUUID(),
      name: formData.name!,
      email: formData.email!,
      phone: formData.phone!,
      address: formData.address!,
      notes: formData.notes
    };

    if (editingSupplier) {
      storage.updateSupplier(supplierData);
      toast.success("Supplier updated successfully");
    } else {
      storage.addSupplier(supplierData);
      toast.success("Supplier added successfully");
    }

    setEditingSupplier(undefined);
    setFormData({});
    loadSuppliers();
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData(supplier);
  };

  const handleDelete = (id: string) => {
    storage.deleteSupplier(id);
    loadSuppliers();
    toast.success("Supplier deleted successfully");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Suppliers</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          <Button type="submit">
            {editingSupplier ? "Update" : "Add"} Supplier
          </Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(supplier)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(supplier.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
