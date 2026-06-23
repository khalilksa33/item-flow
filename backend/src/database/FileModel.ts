import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mongoose from 'mongoose';

const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class FileQueryBuilder<T> {
  private promise: Promise<any>;

  constructor(exec: () => Promise<any>) {
    this.promise = exec();
  }

  then(onfulfilled?: (value: any) => any, onrejected?: (reason: any) => any) {
    return this.promise.then(onfulfilled, onrejected);
  }

  catch(onrejected?: (reason: any) => any) {
    return this.promise.catch(onrejected);
  }

  finally(onfinally?: () => void) {
    return this.promise.finally(onfinally);
  }

  select(fields: string) {
    this.promise = this.promise.then(data => {
      const isExclude = fields.startsWith('-');
      const fieldList = fields.replace(/^[+-]/, '').split(' ');

      const clean = (item: any) => {
        if (!item) return item;
        const copy = typeof item.toObject === 'function' ? item.toObject() : { ...item };
        if (isExclude) {
          fieldList.forEach(f => delete copy[f]);
        } else {
          const obj: any = {};
          fieldList.forEach(f => { obj[f] = copy[f]; });
          return obj;
        }
        return copy;
      };

      if (Array.isArray(data)) return data.map(clean);
      return clean(data);
    });
    return this;
  }

  sort(sortObj: any) {
    this.promise = this.promise.then(data => {
      if (!Array.isArray(data)) return data;
      const [key, direction] = Object.entries(sortObj)[0] || [];
      if (!key) return data;
      return [...data].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA < valB) return direction === 1 ? -1 : 1;
        if (valA > valB) return direction === 1 ? 1 : -1;
        return 0;
      });
    });
    return this;
  }
}

function wrapDocument(doc: any) {
  if (!doc) return doc;
  return {
    ...doc,
    toObject: function() {
      const copy = { ...this };
      delete copy.toObject;
      return copy;
    }
  };
}

export class FileModel<T extends { id?: string; _id?: string }> {
  private filePath: string;

  constructor(private name: string) {
    this.filePath = path.join(DATA_DIR, `${name.toLowerCase()}s.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]));
    }
  }

  private read(): T[] {
    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(content);
    } catch {
      return [];
    }
  }

  private write(data: T[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  find(filter: any = {}) {
    return new FileQueryBuilder(() => {
      const items = this.read().map(wrapDocument);
      // Simple filtering support
      const filtered = items.filter(item => {
        for (const [key, val] of Object.entries(filter)) {
          if (item[key] !== val) return false;
        }
        return true;
      });
      return Promise.resolve(filtered);
    });
  }

  findById(id: string) {
    return new FileQueryBuilder(() => {
      const items = this.read();
      const found = items.find(i => (i.id || i._id) === id);
      return Promise.resolve(wrapDocument(found));
    });
  }

  findOne(filter: any) {
    return new FileQueryBuilder(() => {
      const items = this.read();
      const found = items.find((item: any) => {
        for (const [key, val] of Object.entries(filter)) {
          if (item[key] !== val) return false;
        }
        return true;
      });
      return Promise.resolve(wrapDocument(found));
    });
  }

  async create(doc: any) {
    const items = this.read();
    const id = doc.id || doc._id || crypto.randomUUID();
    const newDoc = {
      ...doc,
      id,
      _id: id,
      createdAt: doc.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    items.push(newDoc);
    this.write(items);
    return wrapDocument(newDoc);
  }

  async findByIdAndUpdate(id: string, update: any, options: any = {}) {
    const items = this.read();
    const idx = items.findIndex(i => (i.id || i._id) === id);
    if (idx === -1) return null;

    const updatedDoc = {
      ...items[idx],
      ...update,
      lastUpdated: new Date().toISOString()
    };
    items[idx] = updatedDoc;
    this.write(items);
    return wrapDocument(updatedDoc);
  }

  async findByIdAndDelete(id: string) {
    const items = this.read();
    const idx = items.findIndex(i => (i.id || i._id) === id);
    if (idx === -1) return null;
    const deleted = items[idx];
    items.splice(idx, 1);
    this.write(items);
    return wrapDocument(deleted);
  }

  async countDocuments(filter: any = {}) {
    const items = this.read();
    const filtered = items.filter((item: any) => {
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] !== val) return false;
      }
      return true;
    });
    return filtered.length;
  }

  async bulkWrite(ops: any[]) {
    // Basic support for settings upsert bulk writes
    const items = this.read();
    for (const op of ops) {
      if (op.updateOne) {
        const { filter, update, upsert } = op.updateOne;
        const idx = items.findIndex((item: any) => {
          for (const [k, v] of Object.entries(filter)) {
            if (item[k] !== v) return false;
          }
          return true;
        });

        const updateData = update.$set || update;
        if (idx !== -1) {
          items[idx] = { ...items[idx], ...updateData, lastUpdated: new Date().toISOString() };
        } else if (upsert) {
          const id = filter.id || filter._id || crypto.randomUUID();
          items.push({
            ...filter,
            ...updateData,
            id,
            _id: id,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          });
        }
      }
    }
    this.write(items);
    return { ok: 1 };
  }

  async aggregate(pipeline: any[]) {
    const items = this.read();
    if (this.name === 'Asset') {
      const byCategory = items.reduce((acc: any[], asset: any) => {
        const existing = acc.find(c => c._id === asset.category);
        if (existing) {
          existing.count += 1;
          existing.totalValue += asset.currentValue;
        } else {
          acc.push({ _id: asset.category, count: 1, totalValue: asset.currentValue });
        }
        return acc;
      }, []);

      const byStatus = items.reduce((acc: any[], asset: any) => {
        const existing = acc.find(c => c._id === asset.status);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({ _id: asset.status, count: 1 });
        }
        return acc;
      }, []);

      const firstGroup = pipeline[0]?.$group?._id;
      if (firstGroup === '$category') {
        return byCategory.sort((a, b) => b.totalValue - a.totalValue);
      }
      if (firstGroup === '$status') {
        return byStatus;
      }
    }
    return [];
  }
}

export function getModel<T>(name: string, schema: any): any {
  if (process.env.DB_TYPE === 'mongodb') {
    return mongoose.models[name] || mongoose.model(name, schema);
  } else {
    return new FileModel(name);
  }
}

