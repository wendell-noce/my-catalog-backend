import { UserRole } from '@prisma/client';

export interface FindManyParams {
  skip: number;
  take: number;
  role?: UserRole;
  email?: string;
  isActive?: boolean;
}

export interface CountParams {
  role?: UserRole;
  isActive?: boolean;
}
