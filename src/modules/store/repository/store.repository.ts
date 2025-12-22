import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateStoreDto } from '../dto/create-store.dto';

@Injectable()
export class StoreRepository {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateStoreDto) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const store = await this.createStore(userId, data);

        if (data.address) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { storeAddressType, is_default, type, ...addressData } =
            data.address;

          const createdAddress = await this.createAddress(addressData);

          await prisma.storeAddress.create({
            data: {
              store_id: store.id,
              address_id: createdAddress.id,
              type: storeAddressType || 'PHYSICAL',
              is_default: is_default ?? true,
            },
          });
        }

        return await prisma.store.findUnique({
          where: { id: store.id },
          include: {
            storeAddresses: {
              include: {
                address: true,
              },
            },
          },
        });
      });
    } catch (error) {
      if (error.code === 'P2002') {
        const target = error.meta?.target;
        throw new ConflictException(
          `Já existe uma loja com esse ${target?.join(', ')}`,
        );
      }

      if (error.code === 'P2003') {
        throw new BadRequestException('Dados de relacionamento inválidos');
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Registro não encontrado');
      }

      console.error('Erro ao criar loja:', error);

      throw new InternalServerErrorException(
        'Erro ao criar loja. Por favor, tente novamente.',
      );
    }
  }

  private createStore(userId: string, data: any) {
    return this.prisma.store.create({
      data: {
        name: data.name,
        slug: data.slug,
        url: data.url,
        description: data.description,
        email: data.email,
        logo: data.logo,
        websiteUrl: data.websiteUrl,
        whatsappUrl: data.whatsappUrl,
        instagramUrl: data.instagramUrl,
        facebookUrl: data.facebookUrl,
        phoneNumber: data.phoneNumber,
        cellPhone: data.cellPhone,
        themeStore: data.themeStore,
        isActive: data.isActive,
        userId,
      },
    });
  }

  private createAddress(addressData: any) {
    return this.prisma.address.create({
      data: {
        street: addressData.street,
        number: addressData.number,
        neighborhood: addressData.neighborhood,
        city: addressData.city,
        state: addressData.state,
        zip_code: addressData.zip_code,
        complement: addressData.complement,
        country: addressData.country || 'Brasil',
      },
    });
  }

  async findBySlug(slug: string): Promise<Store | null> {
    return await this.prisma.store.findUnique({
      where: { slug },
    });
  }
}
