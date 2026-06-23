import mongoose, { Schema, Document } from 'mongoose';

interface ISaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ISale extends Document {
  customerId: string;
  items: ISaleItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentMethod?: string;
  date: Date;
  dueDate?: Date;
  notes?: string;
}

const SaleItemSchema = new Schema<ISaleItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
}, { _id: true });

const SaleSchema = new Schema<ISale>({
  customerId: { type: String, required: true },
  items: [SaleItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  paymentMethod: { type: String },
  date: { type: Date, default: Date.now },
  dueDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const Sale = getModel('Sale', SaleSchema);
