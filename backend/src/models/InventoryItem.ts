import mongoose, { Schema, Document } from 'mongoose';

interface IStockMovement {
  date: Date;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  userId: string;
}

export interface IInventoryItem extends Document {
  name: string;
  description: string;
  quantity: number;
  category: string;
  minQuantity: number;
  imageUrl?: string;
  cost?: number;
  barcode?: string;
  qrCode?: string;
  supplierId?: string;
  lastModifiedBy?: string;
  stockMovements: IStockMovement[];
  lastUpdated: Date;
}

const StockMovementSchema = new Schema<IStockMovement>({
  date: { type: Date, default: Date.now },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['in', 'out'], required: true },
  reason: { type: String, required: true },
  userId: { type: String, required: true },
}, { _id: true });

const InventoryItemSchema = new Schema<IInventoryItem>({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  quantity: { type: Number, required: true, min: 0 },
  category: { type: String, required: true },
  minQuantity: { type: Number, default: 5 },
  imageUrl: { type: String },
  cost: { type: Number },
  barcode: { type: String },
  qrCode: { type: String },
  supplierId: { type: String },
  lastModifiedBy: { type: String },
  stockMovements: [StockMovementSchema],
  lastUpdated: { type: Date, default: Date.now },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const InventoryItem = getModel('InventoryItem', InventoryItemSchema);
