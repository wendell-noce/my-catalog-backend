import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsHexColor,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateProductCategoryDto {
  @ApiProperty({ example: 'Eletrônicos', description: 'Nome da categoria' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'eletronicos',
    description: 'Slug amigável para URL',
  })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug deve conter apenas letras minúsculas, números e hífens (sem espaços ou caracteres especiais)',
  })
  slug: string;

  @ApiPropertyOptional({
    example: 'Produtos tecnológicos e gadgets',
    description: 'Descrição da categoria',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'uuid-da-loja-aqui',
    description: 'ID da loja vinculada',
  })
  @IsUUID()
  storeId: string;

  @ApiPropertyOptional({ default: true, description: 'Status de ativação' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    example: '#FF5733',
    description: 'Cor em hexadecimal para a UI',
  })
  @IsOptional()
  @IsHexColor()
  color?: string;

  @ApiPropertyOptional({
    example: 'icon-monitor',
    description: 'Nome do ícone (Lucide, FontAwesome, etc)',
  })
  @IsOptional()
  @IsString()
  icon?: string;
}
