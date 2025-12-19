import { Address, Store } from '@prisma/client';

export class StoreAddress {
  store_id: string;
  address_id: string;
  type: 'PHYSICAL' | 'BILLING';
  is_default: boolean;

  store?: Store;
  address?: Address;
}
