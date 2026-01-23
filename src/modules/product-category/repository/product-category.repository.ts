import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';

@Injectable()
export class ProductCategoryRepository {
  constructor(private prisma: PrismaService) {}

  private readonly defaultSelect = {
    id: true,
    name: true,
    slug: true,
    description: true,
    storeId: true,
    color: true,
    icon: true,
    isActive: true,
  } satisfies Prisma.ProductCategorySelect;

  async create(data: CreateProductCategoryDto) {
    try {
      const productCategory = await this.prisma.productCategory.create({
        data,
      });
      return productCategory;
    } catch (error) {
      // *** P2002 é o código do Prisma para erro de "Unique Constraint" (ex: slug duplicado)
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Já existe uma categoria com este slug ou nome nesta loja.',
        );
      }

      console.error('Erro ao criar categoria:', error);
      throw new BadRequestException(
        'Não foi possível criar a categoria. Verifique os dados.',
      );
    }
  }

  async findBySlug(slug: string, storeId: string) {
    return this.prisma.productCategory.findFirst({
      where: { slug, storeId, deletedAt: null },
    });
  }

  async findAllByStoreId(storeId: string) {
    return this.prisma.productCategory.findMany({
      where: { storeId, deletedAt: null },
      select: this.defaultSelect,
    });
  }

  async findById(id: string) {
    return this.prisma.productCategory.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.productCategory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
  async update(id: string, data: Partial<CreateProductCategoryDto>) {
    return this.prisma.productCategory.update({
      where: { id },
      data,
    });
  }

  async restore(id: string) {
    return this.prisma.productCategory.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async active(id: string) {
    return this.prisma.productCategory.update({
      where: { id },
      data: {
        isActive: true,
      } as Prisma.ProductCategoryUpdateInput,
      select: this.defaultSelect,
    });
  }

  async deactivate(id: string) {
    return this.prisma.productCategory.update({
      where: { id },
      data: {
        isActive: false,
      } as Prisma.ProductCategoryUpdateInput,
      select: this.defaultSelect,
    });
  }
}
