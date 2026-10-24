export type NoticeCategory = 'Academic' | 'Examination' | 'Events' | 'Placement' | 'General';

export type UserRole = 'admin' | 'student';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface NoticeAuthor {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Notice {
  _id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  date: string;
  createdBy: NoticeAuthor;
  pinned?: boolean;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeStats {
  totalNotices: number;
  categories: Record<NoticeCategory, number>;
  recentNotices: number;
  totalStudents: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
