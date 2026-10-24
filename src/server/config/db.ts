import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { IUser, SafeUser } from '../models/User.js';
import { INotice, NoticeCategory } from '../models/Notice.js';

interface DatabaseSchema {
  users: IUser[];
  notices: INotice[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.users && parsed.notices) {
        return parsed;
      }
    } catch (err) {
      console.error('Error reading db.json, reinitializing default data:', err);
    }
  }

  // Initial seed data with hashed passwords
  const adminSalt = bcrypt.genSaltSync(10);
  const studentSalt = bcrypt.genSaltSync(10);
  const now = new Date().toISOString();

  const initialAdminId = 'usr_admin_001';
  const initialStudentId = 'usr_student_001';

  const defaultAdmin: IUser = {
    _id: initialAdminId,
    name: 'Dr. Evelyn Vance (Dean of Academics)',
    email: 'admin@college.edu',
    password: bcrypt.hashSync('Admin@123', adminSalt),
    role: 'admin',
    createdAt: now,
    updatedAt: now,
  };

  const defaultStudent: IUser = {
    _id: initialStudentId,
    name: 'Alex Rivera',
    email: 'student@college.edu',
    password: bcrypt.hashSync('Student@123', studentSalt),
    role: 'student',
    createdAt: now,
    updatedAt: now,
  };

  const adminAuthor = {
    _id: defaultAdmin._id,
    name: defaultAdmin.name,
    email: defaultAdmin.email,
    role: defaultAdmin.role,
  };

  const defaultNotices: INotice[] = [
    {
      _id: 'ntc_001',
      title: 'End-Semester Examination Schedule - Spring 2026',
      description: 'The finalized timetable for the Spring 2026 End-Semester Examinations for all B.Tech and M.Tech departments is now released. Students must carry their institutional ID card and hall tickets into the examination halls. Cellphones, smartwatches, and programmable calculators are strictly prohibited. Refer to Annexure-A on the portal for detailed slot distributions.',
      category: 'Examination',
      date: '2026-10-15',
      createdBy: adminAuthor,
      pinned: true,
      department: 'Controller of Examinations',
      createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    },
    {
      _id: 'ntc_002',
      title: 'Campus Recruitment Drive: Google & Microsoft Cloud Engineering',
      description: 'The Training & Placement Cell invites eligible Final-Year CSE, IT, and ECE students (minimum CGPA 7.5 with no standing backlogs) to register for the upcoming on-campus technical assessments. The preliminary online aptitude and coding round will commence on October 22, 2026. Submit your updated resumes through the placement portal before midnight on October 18.',
      category: 'Placement',
      date: '2026-10-18',
      createdBy: adminAuthor,
      pinned: true,
      department: 'Training & Placement Cell',
      createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    },
    {
      _id: 'ntc_003',
      title: 'Annual National Technical Symposium - Lakshya LBRCE 2026 Registrations Open',
      description: 'The Department of Computer Science & Engineering presents the Annual Edition of Lakshya LBRCE, a national-level technical symposium and hackathon with project expos, paper presentations, and coding contests. Inter-college teams of 3 to 4 members can register through the department desk or online portal.',
      category: 'Events',
      date: '2026-10-25',
      createdBy: adminAuthor,
      pinned: false,
      department: 'Department of CSE, LBRCE',
      createdAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 72).toISOString(),
    },
    {
      _id: 'ntc_004',
      title: 'Revised Academic Calendar & Winter Break Notification',
      description: 'The Academic Council has approved adjustments to the academic calendar for the current semester. Classes for all ongoing semesters will conclude on November 28, 2026, followed by practical viva voce exams. Winter vacation will be observed from December 15, 2026 to January 04, 2027.',
      category: 'Academic',
      date: '2026-10-12',
      createdBy: adminAuthor,
      pinned: false,
      department: 'Dean of Academic Affairs',
      createdAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 96).toISOString(),
    },
    {
      _id: 'ntc_005',
      title: 'Central Library Extended Study Hours During Exam Weeks',
      description: 'In anticipation of semester finals, the Central University Library will remain open 24/7 starting from Monday, October 16 until the conclusion of the examination schedule. The digital kiosk, Wi-Fi zones, and quiet reading halls on the 2nd and 3rd floors will have uninterrupted power backup and cafeteria service.',
      category: 'General',
      date: '2026-10-14',
      createdBy: adminAuthor,
      pinned: false,
      department: 'University Library Committee',
      createdAt: new Date(Date.now() - 3600 * 1000 * 120).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 120).toISOString(),
    },
    {
      _id: 'ntc_006',
      title: 'Mid-Term Lab Performance Evaluations & Submission Deadline',
      description: 'All 3rd and 5th-semester laboratory records, project milestones, and git repository submissions must be certified by corresponding lab faculty before October 19, 2026. Incomplete lab journals will not be awarded internal grading weightage.',
      category: 'Academic',
      date: '2026-10-19',
      createdBy: adminAuthor,
      pinned: false,
      department: 'Academic Evaluation Office',
      createdAt: new Date(Date.now() - 3600 * 1000 * 144).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 144).toISOString(),
    },
    {
      _id: 'ntc_007',
      title: 'Supplementary & Revaluation Examination Form Submissions',
      description: 'Students applying for revaluation or appearing for odd-semester supplementary examinations must submit Form-B along with bank challan receipts at the Registrar office by October 24, 2026. Late submissions will incur standard administrative penalty charges.',
      category: 'Examination',
      date: '2026-10-24',
      createdBy: adminAuthor,
      pinned: false,
      department: 'Examination Branch',
      createdAt: new Date(Date.now() - 3600 * 1000 * 168).toISOString(),
      updatedAt: new Date(Date.now() - 3600 * 1000 * 168).toISOString(),
    },
  ];

  const initialData: DatabaseSchema = {
    users: [defaultAdmin, defaultStudent],
    notices: defaultNotices,
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  return initialData;
}

let dbCache: DatabaseSchema = ensureDbFile();

function persist(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

// User Collection API (Mongoose-like interface)
export const Users = {
  async find(): Promise<SafeUser[]> {
    return dbCache.users.map(({ password: _, ...safe }) => safe);
  },

  async findOne(predicate: (u: IUser) => boolean): Promise<IUser | null> {
    const user = dbCache.users.find(predicate);
    return user ? { ...user } : null;
  },

  async findByEmail(email: string): Promise<IUser | null> {
    const normalized = email.trim().toLowerCase();
    const user = dbCache.users.find((u) => u.email.toLowerCase() === normalized);
    return user ? { ...user } : null;
  },

  async findById(id: string): Promise<SafeUser | null> {
    const user = dbCache.users.find((u) => u._id === id);
    if (!user) return null;
    const { password: _, ...safe } = user;
    return safe;
  },

  async create(data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<SafeUser> {
    const now = new Date().toISOString();
    const newUser: IUser = {
      _id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      role: data.role || 'student',
      createdAt: now,
      updatedAt: now,
    };
    dbCache.users.push(newUser);
    persist();
    const { password: _, ...safe } = newUser;
    return safe;
  },

  async countDocuments(predicate?: (u: IUser) => boolean): Promise<number> {
    if (!predicate) return dbCache.users.length;
    return dbCache.users.filter(predicate).length;
  },
};

// Notice Collection API (Mongoose-like interface)
export const Notices = {
  async find(filter?: {
    category?: string;
    search?: string;
  }): Promise<INotice[]> {
    let result = [...dbCache.notices];

    if (filter?.category && filter.category !== 'All') {
      result = result.filter(
        (n) => n.category.toLowerCase() === filter.category!.toLowerCase()
      );
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          (n.department && n.department.toLowerCase().includes(q))
      );
    }

    // Sort: pinned first, then by date descending, then createdAt descending
    result.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  },

  async findById(id: string): Promise<INotice | null> {
    const notice = dbCache.notices.find((n) => n._id === id);
    return notice ? { ...notice } : null;
  },

  async create(data: {
    title: string;
    description: string;
    category: NoticeCategory;
    date: string;
    createdBy: { _id: string; name: string; email: string; role: string };
    pinned?: boolean;
    department?: string;
  }): Promise<INotice> {
    const now = new Date().toISOString();
    const newNotice: INotice = {
      _id: `ntc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      date: data.date,
      createdBy: data.createdBy,
      pinned: Boolean(data.pinned),
      department: data.department?.trim() || 'College Administration',
      createdAt: now,
      updatedAt: now,
    };
    dbCache.notices.unshift(newNotice);
    persist();
    return newNotice;
  },

  async findByIdAndUpdate(
    id: string,
    updates: Partial<Omit<INotice, '_id' | 'createdAt' | 'createdBy'>>
  ): Promise<INotice | null> {
    const index = dbCache.notices.findIndex((n) => n._id === id);
    if (index === -1) return null;

    const existing = dbCache.notices[index];
    const updated: INotice = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    dbCache.notices[index] = updated;
    persist();
    return { ...updated };
  },

  async findByIdAndDelete(id: string): Promise<boolean> {
    const initialLength = dbCache.notices.length;
    dbCache.notices = dbCache.notices.filter((n) => n._id !== id);
    if (dbCache.notices.length !== initialLength) {
      persist();
      return true;
    }
    return false;
  },

  async countDocuments(predicate?: (n: INotice) => boolean): Promise<number> {
    if (!predicate) return dbCache.notices.length;
    return dbCache.notices.filter(predicate).length;
  },

  async getCategoryStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {
      Academic: 0,
      Examination: 0,
      Events: 0,
      Placement: 0,
      General: 0,
    };
    for (const notice of dbCache.notices) {
      if (stats[notice.category] !== undefined) {
        stats[notice.category]++;
      } else {
        stats[notice.category] = 1;
      }
    }
    return stats;
  },
};
