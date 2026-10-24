import { Request, Response } from 'express';
import { Notices, Users } from '../config/db.js';
import { NoticeCategory } from '../models/Notice.js';

const VALID_CATEGORIES: NoticeCategory[] = ['Academic', 'Examination', 'Events', 'Placement', 'General'];

export async function getNotices(req: Request, res: Response): Promise<void> {
  try {
    const { category, search } = req.query;

    const notices = await Notices.find({
      category: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
    });

    res.json({
      success: true,
      count: notices.length,
      notices,
    });
  } catch (err: any) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ message: 'Failed to retrieve notices', error: err.message });
  }
}

export async function getNoticeById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const notice = await Notices.findById(id);

    if (!notice) {
      res.status(404).json({ message: 'Notice not found' });
      return;
    }

    res.json({
      success: true,
      notice,
    });
  } catch (err: any) {
    console.error('Error fetching notice by ID:', err);
    res.status(500).json({ message: 'Failed to retrieve notice', error: err.message });
  }
}

export async function createNotice(req: Request, res: Response): Promise<void> {
  try {
    const { title, description, category, date, department, pinned } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      res.status(400).json({ message: 'Title is required (minimum 3 characters)' });
      return;
    }

    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      res.status(400).json({ message: 'Description is required (minimum 5 characters)' });
      return;
    }

    if (!category || !VALID_CATEGORIES.includes(category as NoticeCategory)) {
      res.status(400).json({
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
      return;
    }

    if (!date || typeof date !== 'string' || isNaN(Date.parse(date))) {
      res.status(400).json({ message: 'A valid notice date is required (YYYY-MM-DD)' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const createdNotice = await Notices.create({
      title: title.trim(),
      description: description.trim(),
      category: category as NoticeCategory,
      date: date.trim(),
      createdBy: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
      department: department?.trim() || 'College Administration',
      pinned: Boolean(pinned),
    });

    res.status(201).json({
      success: true,
      message: 'Notice published successfully',
      notice: createdNotice,
    });
  } catch (err: any) {
    console.error('Error creating notice:', err);
    res.status(500).json({ message: 'Failed to publish notice', error: err.message });
  }
}

export async function updateNotice(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { title, description, category, date, department, pinned } = req.body;

    const existing = await Notices.findById(id);
    if (!existing) {
      res.status(404).json({ message: 'Notice not found' });
      return;
    }

    if (category && !VALID_CATEGORIES.includes(category as NoticeCategory)) {
      res.status(400).json({
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`,
      });
      return;
    }

    if (date && isNaN(Date.parse(date))) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    const updated = await Notices.findByIdAndUpdate(id, {
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(category !== undefined && { category }),
      ...(date !== undefined && { date: date.trim() }),
      ...(department !== undefined && { department: department.trim() }),
      ...(pinned !== undefined && { pinned: Boolean(pinned) }),
    });

    res.json({
      success: true,
      message: 'Notice updated successfully',
      notice: updated,
    });
  } catch (err: any) {
    console.error('Error updating notice:', err);
    res.status(500).json({ message: 'Failed to update notice', error: err.message });
  }
}

export async function deleteNotice(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const notice = await Notices.findById(id);

    if (!notice) {
      res.status(404).json({ message: 'Notice not found' });
      return;
    }

    const deleted = await Notices.findByIdAndDelete(id);
    if (!deleted) {
      res.status(500).json({ message: 'Failed to remove notice' });
      return;
    }

    res.json({
      success: true,
      message: 'Notice deleted successfully',
      id,
    });
  } catch (err: any) {
    console.error('Error deleting notice:', err);
    res.status(500).json({ message: 'Failed to delete notice', error: err.message });
  }
}

export async function getNoticeStats(req: Request, res: Response): Promise<void> {
  try {
    const totalNotices = await Notices.countDocuments();
    const categoryStats = await Notices.getCategoryStats();
    const totalStudents = await Users.countDocuments((u) => u.role === 'student');

    // Recent notices published in last 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentNotices = await Notices.countDocuments(
      (n) => new Date(n.createdAt).getTime() >= sevenDaysAgo
    );

    res.json({
      success: true,
      stats: {
        totalNotices,
        categories: categoryStats,
        recentNotices,
        totalStudents,
      },
    });
  } catch (err: any) {
    console.error('Error fetching notice statistics:', err);
    res.status(500).json({ message: 'Failed to retrieve stats', error: err.message });
  }
}
