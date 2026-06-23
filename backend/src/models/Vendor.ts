import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  type: 'manufacturer' | 'wholesaler' | 'distributor';
  products: string[];
  paymentTerms: string;
  taxId: string;
  rating?: number;
  activeContract?: boolean;
  lastOrderDate?: Date;
}

const VendorSchema = new Schema<IVendor>({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String },
  address: { type: String },
  notes: { type: String },
  type: { type: String, enum: ['manufacturer', 'wholesaler', 'distributor'], default: 'wholesaler' },
  products: [{ type: String }],
  paymentTerms: { type: String, default: 'Net 30' },
  taxId: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  activeContract: { type: Boolean, default: false },
  lastOrderDate: { type: Date },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const Vendor = getModel('Vendor', VendorSchema);
