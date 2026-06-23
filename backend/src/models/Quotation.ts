import mongoose, { Schema, Document } from 'mongoose';

interface IQuotationItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  vat: number;
}

export interface IQuotation extends Document {
  customerId: string;
  items: IQuotationItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  notes?: string;
  terms?: string;
}

const QuotationItemSchema = new Schema<IQuotationItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  vat: { type: Number, default: 0 },
}, { _id: true });

const QuotationSchema = new Schema<IQuotation>({
  customerId: { type: String, required: true },
  items: [QuotationItemSchema],
  subtotal: { type: Number, required: true },
  vatRate: { type: Number, default: 15 },
  vatAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'], default: 'draft' },
  validUntil: { type: Date, required: true },
  notes: { type: String },
  terms: { type: String },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const Quotation = getModel('Quotation', QuotationSchema);
