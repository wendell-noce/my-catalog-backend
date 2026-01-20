import { ConflictException, Injectable } from '@nestjs/common';
import { Store } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateStoreDto } from '../dto/create-store.dto';

@Injectable()
export class StoreRepository {
  constructor(private prisma: PrismaService) {}

  /* eslint-disable max-lines-per-function */
  async create(userId: string, data: CreateStoreDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const store = await tx.store.create({
          data: {
            userId: userId,
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
            themeStore: data.themeStore || 'DEFAULT',
            isActive: data.isActive ?? true,
          },
        });

        if (data.address) {
          /* eslint-disable @typescript-eslint/no-unused-vars */
          const { storeAddressType, is_default, type, ...addressData } =
            data.address;
          const createdAddress = await tx.address.create({
            data: {
              ...addressData,
            },
          });

          await tx.storeAddress.create({
            data: {
              store_id: store.id,
              address_id: createdAddress.id,
              type: storeAddressType || 'PHYSICAL',
              is_default: is_default ?? true,
            },
          });
        }

        return await tx.store.findUnique({
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
        const target = error.meta?.target as string[];
        throw new ConflictException(
          `Já existe um registro com este(s) campo(s): ${target?.join(', ')}`,
        );
      }
      console.error('Erro detalhado no Repository:', error);
      throw error;
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
        zip_code: addressData.zipCode,
        complement: addressData.complement,
        country: addressData.country || 'Brasil',
      },
    });
  }

  async findBySlug(slug: string): Promise<Store | null> {
    const store = await this.prisma.store.findUnique({
      where: { slug },
    });

    return store;
  }

  async update(storeId: string, data: any) {
    // Use o seu UpdateStoreDto aqui
    try {
      return await this.prisma.$transaction(async (tx) => {
        const { address, ...storeData } = data;

        await tx.store.update({
          where: { id: storeId },
          data: storeData,
        });

        if (address) {
          /* eslint-disable @typescript-eslint/no-unused-vars */
          const { storeAddressType, is_default, type, ...addressData } =
            address;

          const storeAddressRecord = await tx.storeAddress.findFirst({
            where: { store_id: storeId, is_default: true },
          });

          if (storeAddressRecord) {
            await tx.address.update({
              where: { id: storeAddressRecord.address_id },
              data: addressData,
            });

            await tx.storeAddress.update({
              where: {
                store_id_address_id: {
                  store_id: storeId,
                  address_id: storeAddressRecord.address_id,
                },
              },
              data: {
                type: storeAddressType,
                is_default: is_default,
              },
            });
          }
        }

        return await tx.store.findUnique({
          where: { id: storeId },
          include: {
            storeAddresses: {
              include: { address: true },
            },
          },
        });
      });
    } catch (error) {
      console.error('Erro no update do Repository:', error);
      throw error;
    }
  }

  async remove(id: string): Promise<Store> {
    return this.prisma.store.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(id: string): Promise<Store> {
    return this.prisma.store.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}
