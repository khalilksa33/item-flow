import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'individual' | 'business';
  taxId?: string;
  creditLimit?: number;
  paymentTerms?: string;
  notes?: string;
}

const CustomerSchema = new Schema<ICustomer>({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String },
  address: { type: String },
  type: { type: String, enum: ['individual', 'business'], default: 'individual' },
  taxId: { type: String },
  creditLimit: { type: Number },
  paymentTerms: { type: String },
  notes: { type: String },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const Customer = getModel('Customer', CustomerSchema);
