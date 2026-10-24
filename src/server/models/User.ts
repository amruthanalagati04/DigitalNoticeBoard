export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'student';
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<IUser, 'password'>;
