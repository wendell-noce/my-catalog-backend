// addresses/dto/create-address.dto.ts
import { IsEnum, IsOptional, IsString, Length, Matches } from 'class-validator';

export enum AddressType {
  MAIN = 'MAIN',
  DELIVERY = 'DELIVERY',
  BILLING = 'BILLING',
  WORK = 'WORK',
}

export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  number: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  @Length(2, 2)
  state: string;

  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  zip_code: string;

  @IsOptional()
  @IsString()
  complement?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsEnum(AddressType)
  type: AddressType;
}
