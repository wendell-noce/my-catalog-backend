export class Address {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  complement?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
