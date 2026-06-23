import { Router, Response } from 'express';
import { AuditLog } from '../models/AuditLog';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
router.use(authenticate);
router.use(requireRole('admin', 'manager'));

router.get('/', async (_req, res: Response) => {
  res.json(await AuditLog.find().sort({ date: -1 }).limit(500));
});

router.post('/', async (req, res: Response) => {
  try { res.status(201).json(await AuditLog.create(req.body)); }
  catch (e: any) { res.status(400).json({ error: e.message }); }
});

export default router;
