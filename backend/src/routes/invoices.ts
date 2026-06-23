import { Router, Response } from 'express';
import { Invoice } from '../models/Invoice';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req, res: Response) => {
  res.json(await Invoice.find().sort({ createdAt: -1 }));
});
router.get('/:id', async (req, res: Response) => {
  const item = await Invoice.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json(item);
});
router.post('/', async (req, res: Response) => {
  try { res.status(201).json(await Invoice.create(req.body)); }
  catch (e: any) { res.status(400).json({ error: e.message }); }
});
router.put('/:id', async (req, res: Response) => {
  try {
    const item = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e: any) { res.status(400).json({ error: e.message }); }
});
router.delete('/:id', async (req, res: Response) => {
  const item = await Invoice.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
