import api from './api.js';
import { Notice, NoticeCategory, NoticeStats } from '../types/index.js';

export interface CreateNoticePayload {
  title: string;
  description: string;
  category: NoticeCategory;
  date: string;
  department?: string;
  pinned?: boolean;
}

export interface UpdateNoticePayload {
  title?: string;
  description?: string;
  category?: NoticeCategory;
  date?: string;
  department?: string;
  pinned?: boolean;
}

export const noticeService = {
  async getNotices(params?: { category?: string; search?: string }): Promise<Notice[]> {
    const res = await api.get<{ success: boolean; count: number; notices: Notice[] }>('/notices', {
      params,
    });
    return res.data.notices;
  },

  async getNoticeById(id: string): Promise<Notice> {
    const res = await api.get<{ success: boolean; notice: Notice }>(`/notices/${id}`);
    return res.data.notice;
  },

  async createNotice(data: CreateNoticePayload): Promise<Notice> {
    const res = await api.post<{ success: boolean; message: string; notice: Notice }>('/notices', data);
    return res.data.notice;
  },

  async updateNotice(id: string, data: UpdateNoticePayload): Promise<Notice> {
    const res = await api.put<{ success: boolean; message: string; notice: Notice }>(`/notices/${id}`, data);
    return res.data.notice;
  },

  async deleteNotice(id: string): Promise<{ success: boolean; message: string }> {
    const res = await api.delete<{ success: boolean; message: string }>(`/notices/${id}`);
    return res.data;
  },

  async getStats(): Promise<NoticeStats> {
    const res = await api.get<{ success: boolean; stats: NoticeStats }>('/notices/stats');
    return res.data.stats;
  },
};
