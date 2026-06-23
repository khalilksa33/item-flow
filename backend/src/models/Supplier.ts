import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

const SupplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String },
  address: { type: String },
  notes: { type: String },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const Supplier = getModel('Supplier', SupplierSchema);
