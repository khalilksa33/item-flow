import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  key: string;
  value: string;
}

const SettingsSchema = new Schema<ISettings>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const Settings = getModel('Settings', SettingsSchema);
