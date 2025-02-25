
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/inventory";

interface CustomerFormProps {
  editingCustomer: Customer | null;
  onSubmit: (data: Omit<Customer, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  onCancel: () => void;
}

export function CustomerForm({ editingCustomer, onSubmit, onCancel }: CustomerFormProps) {
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'createdAt' | 'lastUpdated'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'individual',
  });

  useEffect(() => {
    if (editingCustomer) {
      setFormData({
        name: editingCustomer.name,
        email: editingCustomer.email,
        phone: editingCustomer.phone,
        address: editingCustomer.address,
        type: editingCustomer.type,
        taxId: editingCustomer.taxId,
        creditLimit: editingCustomer.creditLimit,
        paymentTerms: editingCustomer.paymentTerms,
        notes: editingCustomer.notes,
      });
    }
  }, [editingCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          onChange={(e) => setFormData({ ...formData, type: e.target.value as 'individual' | 'business' })}
          required
        >
          <option value="individual">Individual</option>
          <option value="business">Business</option>
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

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
      </div>

      {formData.type === 'business' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input
              id="taxId"
              value={formData.taxId || ''}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit">Credit Limit</Label>
            <Input
              id="creditLimit"
              type="number"
              value={formData.creditLimit || ''}
              onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              value={formData.paymentTerms || ''}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {editingCustomer ? "Update" : "Add"} Customer
        </Button>
      </div>
    </form>
  );
}
