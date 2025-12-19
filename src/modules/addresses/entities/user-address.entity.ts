import { Address, User } from '@prisma/client';

export class UserAddress {
  user_id: string;
  address_id: string;
  type: 'MAIN' | 'DELIVERY' | 'BILLING' | 'WORK';
  is_default: boolean;

  user?: User;
  address?: Address;
}
