export type AssetCategory =
  | 'IT Equipment'
  | 'Vehicles'
  | 'Furniture'
  | 'Machinery'
  | 'Buildings'
  | 'Office Equipment'
  | 'Other';

export type AssetStatus = 'active' | 'under_maintenance' | 'disposed' | 'lost';
export type DepreciationMethod = 'straight-line' | 'declining-balance' | 'none';

export const ASSET_CATEGORIES: AssetCategory[] = [
  'IT Equipment',
  'Vehicles',
  'Furniture',
  'Machinery',
  'Buildings',
  'Office Equipment',
  'Other',
];

export const ASSET_STATUS_LABELS: Record<AssetStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  under_maintenance: { label: 'Under Maintenance', color: 'bg-yellow-100 text-yellow-800' },
  disposed: { label: 'Disposed', color: 'bg-gray-100 text-gray-800' },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-800' },
};

export interface Asset {
  _id?: string;
  id?: string;
  name: string;
  assetTag: string;
  category: AssetCategory;
  status: AssetStatus;
  assignedTo?: string;
  location?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: DepreciationMethod;
  depreciationRate?: number;
  warrantyExpiry?: string;
  serialNumber?: string;
  notes?: string;
  imageUrl?: string;
  lastUpdated?: string;
  createdAt?: string;
}

/** Calculate straight-line depreciation current value */
export function calcStraightLineValue(
  purchasePrice: number,
  purchaseDate: string,
  depreciationRate: number
): number {
  const years = (Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  const depreciated = purchasePrice * (depreciationRate / 100) * years;
  return Math.max(0, purchasePrice - depreciated);
}

/** Calculate declining balance current value */
export function calcDecliningValue(
  purchasePrice: number,
  purchaseDate: string,
  depreciationRate: number
): number {
  const years = (Date.now() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, purchasePrice * Math.pow(1 - depreciationRate / 100, years));
}
