// addresses/dto/create-address.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export enum AddressType {
  MAIN = 'MAIN',
  DELIVERY = 'DELIVERY',
  BILLING = 'BILLING',
  WORK = 'WORK',
}

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'A rua é obrigatória' })
  street: string;

  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório' })
  number: string;

  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  neighborhood: string;

  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  city: string;

  @IsString()
  @Length(2, 2)
  @IsNotEmpty({ message: 'O estado é obrigatório' })
  state: string;

  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
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
