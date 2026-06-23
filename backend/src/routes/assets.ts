import { Router, Response } from 'express';
import { Asset } from '../models/Asset';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req, res: Response) => {
  res.json(await Asset.find().sort({ name: 1 }));
});

router.get('/analytics', async (_req, res: Response) => {
  const [assets, byCategory, byStatus] = await Promise.all([
    Asset.find(),
    Asset.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: '$currentValue' } } },
      { $sort: { totalValue: -1 } },
    ]),
    Asset.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
  ]);
  const totalValue = assets.reduce((sum: number, a: any) => sum + a.currentValue, 0);
  const totalPurchaseValue = assets.reduce((sum: number, a: any) => sum + a.purchasePrice, 0);
  res.json({ totalAssets: assets.length, totalValue, totalPurchaseValue, byCategory, byStatus });
});

router.get('/:id', async (req, res: Response) => {
  const item = await Asset.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/', async (req, res: Response) => {
  try { res.status(201).json(await Asset.create(req.body)); }
  catch (e: any) { res.status(400).json({ error: e.message }); }
});

router.put('/:id', async (req, res: Response) => {
  try {
    const item = await Asset.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});

router.delete('/:id', async (req, res: Response) => {
  const item = await Asset.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
