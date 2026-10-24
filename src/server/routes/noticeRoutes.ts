import { Router } from 'express';
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
  getNoticeStats,
} from '../controllers/noticeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes (accessible to students, guests, and admins)
router.get('/', getNotices);
router.get('/stats', getNoticeStats);
router.get('/:id', getNoticeById);

// Admin-only protected routes
router.post('/', protect, adminOnly, createNotice);
router.put('/:id', protect, adminOnly, updateNotice);
router.delete('/:id', protect, adminOnly, deleteNotice);

export default router;
