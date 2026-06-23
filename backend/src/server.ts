import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Routes
import authRouter from './routes/auth';
import inventoryRouter from './routes/inventory';
import customersRouter from './routes/customers';
import vendorsRouter from './routes/vendors';
import salesRouter from './routes/sales';
import quotationsRouter from './routes/quotations';
import invoicesRouter from './routes/invoices';
import usersRouter from './routes/users';
import categoriesRouter from './routes/categories';
import suppliersRouter from './routes/suppliers';
import auditLogsRouter from './routes/auditLogs';
import settingsRouter from './routes/settings';
import assetsRouter from './routes/assets';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/itemflow';

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/customers', customersRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/sales', salesRouter);
app.use('/api/quotations', quotationsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/audit-logs', auditLogsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/assets', assetsRouter);

// ── Error handler ─────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ── Database + Start ──────────────────────────────────────────
async function start() {
  try {
    if (process.env.DB_TYPE === 'mongodb') {
      await mongoose.connect(MONGODB_URI);
      console.log('✅ Connected to MongoDB:', MONGODB_URI.replace(/\/\/.*@/, '//***@'));
    } else {
      console.log('✅ Database Mode: Local JSON File DB');
    }

    // Seed default admin user if DB is empty
    const { User } = await import('./models/User');
    const bcrypt = await import('bcryptjs');
    const count = await User.countDocuments();
    if (count === 0) {
      const hashedPassword = await bcrypt.default.hash('admin123', 12);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    }

    app.listen(PORT, () => {
      console.log(`🚀 Backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start:', err);
    process.exit(1);
  }
}

start();
