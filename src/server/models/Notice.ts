export type NoticeCategory = 'Academic' | 'Examination' | 'Events' | 'Placement' | 'General';

export interface INoticeAuthor {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface INotice {
  _id: string;
  title: string;
  description: string;
  category: NoticeCategory;
  date: string; // YYYY-MM-DD
  createdBy: INoticeAuthor;
  pinned?: boolean;
  department?: string;
  createdAt: string;
  updatedAt: string;
}
