import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: 'create' | 'update' | 'delete';
  itemId: string;
  userId: string;
  details: string;
  date: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
  action: { type: String, enum: ['create', 'update', 'delete'], required: true },
  itemId: { type: String, required: true },
  userId: { type: String, required: true },
  details: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const AuditLog = getModel('AuditLog', AuditLogSchema);
