import mongoose, { Schema, Document } from 'mongoose';

export interface IZatcaSettings extends Document {
  vatNumber: string;
  sellerName: string;
  onboarded: boolean;
  privateKey?: string;
  publicKey?: string;
  certificate?: string;
  complianceCertificate?: string;
  complianceCertificateId?: string;
  productionCertificate?: string;
  productionCertificateId?: string;
  environment: 'sandbox' | 'simulation' | 'production';
  invoiceCounter: number;
  lastInvoiceHash?: string;
  otp?: string;
}

const ZatcaSettingsSchema = new Schema<IZatcaSettings>({
  vatNumber: { type: String, required: true, unique: true },
  sellerName: { type: String, required: true },
  onboarded: { type: Boolean, default: false },
  privateKey: { type: String },
  publicKey: { type: String },
  certificate: { type: String },
  complianceCertificate: { type: String },
  complianceCertificateId: { type: String },
  productionCertificate: { type: String },
  productionCertificateId: { type: String },
  environment: { type: String, enum: ['sandbox', 'simulation', 'production'], default: 'sandbox' },
  invoiceCounter: { type: Number, default: 0 },
  lastInvoiceHash: { type: String, default: '0000000000000000000000000000000000000000000000000000000000000000' },
  otp: { type: String }
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const ZatcaSettings = getModel('ZatcaSettings', ZatcaSettingsSchema);
