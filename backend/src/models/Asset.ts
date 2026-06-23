import mongoose, { Schema, Document } from 'mongoose';

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

export interface IAsset extends Document {
  name: string;
  assetTag: string;
  category: AssetCategory;
  status: AssetStatus;
  assignedTo?: string;
  location?: string;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  depreciationMethod: DepreciationMethod;
  depreciationRate?: number;
  warrantyExpiry?: Date;
  serialNumber?: string;
  notes?: string;
  imageUrl?: string;
  lastUpdated: Date;
}

const AssetSchema = new Schema<IAsset>({
  name: { type: String, required: true, trim: true },
  assetTag: { type: String, required: true, unique: true, trim: true },
  category: {
    type: String,
    enum: ['IT Equipment', 'Vehicles', 'Furniture', 'Machinery', 'Buildings', 'Office Equipment', 'Other'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'under_maintenance', 'disposed', 'lost'],
    default: 'active',
  },
  assignedTo: { type: String },
  location: { type: String },
  purchaseDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true, min: 0 },
  currentValue: { type: Number, required: true, min: 0 },
  depreciationMethod: {
    type: String,
    enum: ['straight-line', 'declining-balance', 'none'],
    default: 'straight-line',
  },
  depreciationRate: { type: Number, min: 0, max: 100 },
  warrantyExpiry: { type: Date },
  serialNumber: { type: String },
  notes: { type: String },
  imageUrl: { type: String },
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-update lastUpdated on save
AssetSchema.pre('save', function (next) {
  this.lastUpdated = new Date();
  next();
});

import { getModel } from '../database/FileModel';

export const Asset = getModel('Asset', AssetSchema);
