import { Router, Response } from 'express';
import { InventoryItem } from '../models/InventoryItem';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req, res: Response) => {
  const items = await InventoryItem.find().sort({ name: 1 });
  res.json(items);
});

router.get('/:id', async (req, res: Response) => {
  const item = await InventoryItem.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const item = await InventoryItem.create({ ...req.body, lastModifiedBy: req.user?.username });
    res.status(201).json(item);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const item = await InventoryItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastModifiedBy: req.user?.username, lastUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', async (req, res: Response) => {
  const item = await InventoryItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
