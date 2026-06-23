import { Router, Response } from 'express';
import { Category } from '../models/Category';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req, res: Response) => {
  res.json(await Category.find().sort({ name: 1 }));
});
router.post('/', async (req, res: Response) => {
  try { res.status(201).json(await Category.create(req.body)); }
  catch (e: any) { res.status(400).json({ error: e.message }); }
});
router.delete('/:id', async (req, res: Response) => {
  const item = await Category.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
