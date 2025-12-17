import { UserRole } from '@prisma/client';

export interface FindAllParams {
  page: number;
  limit: number;
  role?: UserRole;
  isActive?: boolean;
  email?: string;
}
