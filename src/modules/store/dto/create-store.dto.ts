import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StoreAddressType, ThemeStore } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
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
  @ApiProperty({ example: 'Loja de teste' })
  @IsString()
  @IsNotEmpty({ message: 'O nome da loja é obrigatório' })
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'loja-de-teste' })
  @IsString()
  @IsNotEmpty({ message: 'O slug (URL amigável) é obrigatório' })
  @MinLength(3)
  @MaxLength(100)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'O slug deve conter apenas letras minúsculas, números e hífens',
  })
  slug: string;

  @ApiProperty({ example: 'loja-de-teste' })
  @IsString()
  url: string;

  @ApiPropertyOptional({ example: 'Descriçao da loja' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'email@daloja.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'url da logo' })
  @IsOptional()
  @IsString()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ example: 'www.sitedaloja.com' })
  @IsOptional()
  @IsString()
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: 'https://wa.me/5561999999999' })
  @IsOptional()
  @IsString()
  @IsUrl()
  whatsappUrl?: string;

  @ApiPropertyOptional({ example: 'https://instagram.com/loja' })
  @IsOptional()
  @IsString()
  @IsUrl()
  instagramUrl?: string;

  @ApiPropertyOptional({ example: 'https://facebook.com/loja' })
  @IsOptional()
  @IsString()
  @IsUrl()
  facebookUrl?: string;

  @ApiPropertyOptional({ example: '(61) 99999-9999' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '(61) 99999-9999' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  cellPhone?: string;

  @ApiPropertyOptional({
    enum: () => ThemeStore,
    description: 'Tema da loja',
    default: ThemeStore.DEFAULT,
  })
  @IsOptional()
  @IsEnum(ThemeStore, {
    message: 'Tema inválido. Escolha um dos temas suportados.',
  })
  themeStore?: ThemeStore;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    type: () => CreateStoreAddressDto,
    description: 'Endereço principal da loja',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateStoreAddressDto)
  address?: CreateStoreAddressDto;
}
