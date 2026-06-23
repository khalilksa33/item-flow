import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

import { getModel } from '../database/FileModel';

export const Category = getModel('Category', CategorySchema);
