import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AddressType, Prisma, User } from '@prisma/client';
import { UpdateAddressDto } from 'src/modules/addresses/dto/update-address.dto';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
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
    profileCompleted: true,
    stripeCustomerId: true,
  } satisfies Prisma.UserSelect;

  async create(data: CreateUserDto): Promise<{ message: string }> {
    const { address, ...userData } = data;
    const { type, ...addressData } = address;

    await this.prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: userData,
      });

      // 2. Criar o endereço
      const createdAddress = await prisma.address.create({
        data: addressData,
      });

      // 3. Criar a relação user-address
      await prisma.userAddress.create({
        data: {
          user_id: user.id,
          address_id: createdAddress.id,
          type: type,
        },
      });
    });

    return { message: 'Usuário criado com sucesso' };
  }

  async register(registerUser: RegisterUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: registerUser,
        select: {
          id: true,
          email: true,
          name: true,
          isActive: false,
          emailVerified: false,
        },
      });

      return user;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw new InternalServerErrorException(
        'Erro ao criar usuário. Por favor, tente novamente.',
      );
    }
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
    const { address, ...userData } = data;

    if (!address) {
      return this.updateUserOnly(id, userData);
    }

    return this.updateUserWithAddress(id, userData, address);
  }

  private async updateUserOnly(id: string, userData: Partial<UpdateUserDto>) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
      select: this.defaultSelect,
    });
  }

  private async updateUserWithAddress(
    id: string,
    userData: Partial<UpdateUserDto>,
    address: UpdateAddressDto,
  ) {
    const { type, ...addressData } = address;

    return this.prisma.$transaction(async (prisma) => {
      const mainAddress = await this.findUserAddress(id, type, prisma);

      if (!mainAddress) {
        await this.createNewAddress(id, addressData, type, prisma);
      } else {
        await this.updateExistingAddress(
          mainAddress.address_id,
          addressData,
          prisma,
        );
      }

      return this.updateUserOnly(id, userData);
    });
  }

  private async findUserAddress(
    userId: string,
    type: AddressType | undefined,
    prisma: any,
  ) {
    return prisma.userAddress.findFirst({
      where: {
        user_id: userId,
        type: type || 'MAIN',
      },
    });
  }

  private async createNewAddress(
    userId: string,
    addressData: Partial<UpdateAddressDto>,
    type: AddressType | undefined,
    prisma: any,
  ) {
    const newAddress = await prisma.address.create({
      data: addressData,
    });

    await prisma.userAddress.create({
      data: {
        user_id: userId,
        address_id: newAddress.id,
        type: type || 'MAIN',
        is_default: true,
      },
    });
  }

  private async updateExistingAddress(
    addressId: string,
    addressData: Partial<UpdateAddressDto>,
    prisma: any,
  ) {
    await prisma.address.update({
      where: { id: addressId },
      data: addressData,
    });
  }

  async softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async findWithAddressById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...this.defaultSelect,
        userAddresses: {
          select: {
            type: true,
            is_default: true,
            address: {
              select: {
                street: true,
                number: true,
                neighborhood: true,
                city: true,
                state: true,
                zip_code: true,
                country: true,
                complement: true,
              },
            },
          },
        },
      },
    });
  }

  async updateStripeId(userId: string, stripeCustomerId: string) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripeCustomerId: stripeCustomerId,
      },
    });
  }
}
