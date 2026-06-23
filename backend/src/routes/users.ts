import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);
router.use(requireRole('admin'));

router.get('/', async (_req, res: Response) => {
  const users = await User.find().select('-password').sort({ username: 1 });
  res.json(users);
});

router.get('/:id', async (req, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

router.post('/', async (req, res: Response) => {
  try {
    const { username, password, role, isActive } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, password: hashed, role, isActive });
    const { password: _, ...safe } = user.toObject();
    res.status(201).json(safe);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const update: Record<string, unknown> = { ...req.body };
    if (update.password && typeof update.password === 'string') {
      update.password = await bcrypt.hash(update.password, 12);
    } else {
      delete update.password;
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  if (req.user?.id === req.params.id) {
    return res.status(400).json({ error: 'Cannot delete yourself' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

export default router;
