import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  CountParams,
  FindManyParams,
} from '../interfaces/find-many-users.interface';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  private readonly defaultSelect = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    document: true,
    cellPhone: true,
    birthDate: true,
    gender: true,
    role: true,
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(data: CreateUserDto): Promise<{ message: string }> {
    await this.prisma.user.create({
      data,
    });

    return { message: 'Usuário cadastrado com sucesso' };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: this.defaultSelect,
    });
  }

  async findMany(params: FindManyParams) {
    const { skip, take, role, isActive } = params;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.user.findMany({
      where,
      select: this.defaultSelect,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(params: CountParams) {
    const { role, isActive } = params;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return this.prisma.user.count({ where });
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: this.defaultSelect,
    });
  }
}
