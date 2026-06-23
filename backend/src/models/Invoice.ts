import mongoose, { Schema, Document } from 'mongoose';

interface IInvoiceItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  vat: number;
}

export interface IInvoice extends Document {
  customerId: string;
  quotationId?: string;
  items: IInvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  paymentDue: Date;
  paymentTerms?: string;
  notes?: string;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  vat: { type: Number, default: 0 },
}, { _id: true });

const InvoiceSchema = new Schema<IInvoice>({
  customerId: { type: String, required: true },
  quotationId: { type: String },
  items: [InvoiceItemSchema],
  subtotal: { type: Number, required: true },
  vatRate: { type: Number, default: 15 },
  vatAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: { type: String, enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'], default: 'draft' },
  paymentStatus: { type: String, enum: ['unpaid', 'partial', 'paid'], default: 'unpaid' },
  paymentDue: { type: Date, required: true },
  paymentTerms: { type: String },
  notes: { type: String },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const Invoice = getModel('Invoice', InvoiceSchema);
