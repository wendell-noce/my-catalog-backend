import { StoreAddressType, ThemeStore } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';

export class CreateStoreAddressDto extends CreateAddressDto {
  @IsOptional()
  @IsEnum(StoreAddressType)
  storeAddressType?: StoreAddressType;

  @IsOptional()
  @IsBoolean()
  is_default?: boolean;
}

export class CreateStoreDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  slug: string;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  logo?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  websiteUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  whatsappUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  instagramUrl?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  facebookUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  cellPhone?: string;

  @IsOptional()
  @IsEnum(ThemeStore)
  themeStore?: ThemeStore;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStoreAddressDto)
  address?: CreateStoreAddressDto;
}
