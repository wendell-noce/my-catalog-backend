import { Gender, UserRole } from '@prisma/client';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  document: string | null;
  cellPhone: string | null;
  birthDate: Date | null;
  gender: Gender;
  role: UserRole;
  isActive: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
