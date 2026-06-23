import { Router, Response } from 'express';
import { Settings } from '../models/Settings';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// GET /api/settings — returns all as { key: value } object
router.get('/', async (_req, res: Response) => {
  const settings = await Settings.find();
  const obj: Record<string, string> = {};
  settings.forEach((s: any) => { obj[s.key] = s.value; });
  res.json(obj);
});

// PUT /api/settings — upsert many keys at once
router.put('/', async (req, res: Response) => {
  try {
    const updates = req.body as Record<string, string>;
    const ops = Object.entries(updates).map(([key, value]) => ({
      updateOne: {
        filter: { key },
        update: { $set: { key, value } },
        upsert: true,
      },
    }));
    await Settings.bulkWrite(ops);
    const settings = await Settings.find();
    const obj: Record<string, string> = {};
    settings.forEach((s: any) => { obj[s.key] = s.value; });
    res.json(obj);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
