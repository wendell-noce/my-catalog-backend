import { ApiProperty } from '@nestjs/swagger';
import { Gender, UserRole } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'joao@example.com', description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({ example: 'Senha@123', description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais',
  })
  password: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Nome completo do usuário',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Documento é obrigatório' })
  @Matches(/^\d{11}$|^\d{14}$/, {
    message: 'Documento deve ser CPF (11 dígitos) ou CNPJ (14 dígitos)',
  })
  document: string;

  @IsString()
  @IsNotEmpty({ message: 'Celular é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Celular deve ter 10 ou 11 dígitos',
  })
  cellPhone: string;

  @IsDateString({}, { message: 'Data de nascimento inválida' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  birthDate: string;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender, { message: 'Gênero inválido' })
  @IsNotEmpty({ message: 'Gênero é obrigatório' })
  gender: Gender;

  @ApiProperty({ example: 'https://i.pravatar.cc/300?u=joao', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    default: UserRole.USER,
  })
  @IsEnum(UserRole, { message: 'Role inválida' })
  @IsOptional()
  role?: UserRole = UserRole.USER;
}
