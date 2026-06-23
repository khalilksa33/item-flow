import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Asset, ASSET_CATEGORIES, AssetCategory, AssetStatus, DepreciationMethod } from '@/types/asset';
import { toast } from 'sonner';
import { assetsApi } from '@/lib/api';

interface AssetFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  asset?: Asset | null;
}

const emptyAsset: Omit<Asset, '_id' | 'id' | 'lastUpdated' | 'createdAt'> = {
  name: '',
  assetTag: '',
  category: 'IT Equipment',
  status: 'active',
  assignedTo: '',
  location: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  purchasePrice: 0,
  currentValue: 0,
  depreciationMethod: 'straight-line',
  depreciationRate: 20,
  warrantyExpiry: '',
  serialNumber: '',
  notes: '',
};

export function AssetForm({ isOpen, onClose, onSave, asset }: AssetFormProps) {
  const [form, setForm] = useState({ ...emptyAsset });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (asset) {
      setForm({
        name: asset.name,
        assetTag: asset.assetTag,
        category: asset.category,
        status: asset.status,
        assignedTo: asset.assignedTo || '',
        location: asset.location || '',
        purchaseDate: asset.purchaseDate?.split('T')[0] || '',
        purchasePrice: asset.purchasePrice,
        currentValue: asset.currentValue,
        depreciationMethod: asset.depreciationMethod,
        depreciationRate: asset.depreciationRate,
        warrantyExpiry: asset.warrantyExpiry?.split('T')[0] || '',
        serialNumber: asset.serialNumber || '',
        notes: asset.notes || '',
      });
    } else {
      setForm({ ...emptyAsset });
    }
  }, [asset, isOpen]);

  const set = (field: string, value: unknown) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.assetTag) {
      toast.error('Name and Asset Tag are required');
      return;
    }
    setSaving(true);
    try {
      const id = asset?._id || asset?.id;
      if (id) {
        await assetsApi.update(id, form);
        toast.success('Asset updated successfully');
      } else {
        await assetsApi.create(form);
        toast.success('Asset created successfully');
      }
      onSave();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to save asset');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{asset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name *</Label>
              <Input id="name" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assetTag">Asset Tag *</Label>
              <Input id="assetTag" placeholder="IT-0042" value={form.assetTag} onChange={e => set('assetTag', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => set('category', v as AssetCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ASSET_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => set('status', v as AssetStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="under_maintenance">Under Maintenance</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input id="assignedTo" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={form.location} onChange={e => set('location', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input id="purchaseDate" type="date" value={form.purchaseDate} onChange={e => set('purchaseDate', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input id="warrantyExpiry" type="date" value={form.warrantyExpiry} onChange={e => set('warrantyExpiry', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (SAR)</Label>
              <Input id="purchasePrice" type="number" min="0" step="0.01" value={form.purchasePrice}
                onChange={e => set('purchasePrice', parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value (SAR)</Label>
              <Input id="currentValue" type="number" min="0" step="0.01" value={form.currentValue}
                onChange={e => set('currentValue', parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Depreciation Method</Label>
              <Select value={form.depreciationMethod} onValueChange={v => set('depreciationMethod', v as DepreciationMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight-line">Straight-Line</SelectItem>
                  <SelectItem value="declining-balance">Declining Balance</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="depreciationRate">Depreciation Rate (% / year)</Label>
              <Input id="depreciationRate" type="number" min="0" max="100" value={form.depreciationRate || ''}
                onChange={e => set('depreciationRate', parseFloat(e.target.value) || 0)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input id="serialNumber" value={form.serialNumber} onChange={e => set('serialNumber', e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : asset ? 'Update Asset' : 'Create Asset'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
