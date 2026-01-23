import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { SlugUtil } from 'src/common/util/slug.util';
import { StoreRepository } from 'src/modules/store/repository/store.repository';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto';
import { ProductCategoryRepository } from '../repository/product-category.repository';

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly storeRepository: StoreRepository,
    private readonly repository: ProductCategoryRepository,
  ) {}

  async create(data: CreateProductCategoryDto) {
    const existingStore = await this.storeRepository.findById(data.storeId);

    if (!existingStore) {
      throw new ConflictException(
        `Loja com o slug "${data.slug}" não encontrada"`,
      );
    }

    if (!data.slug || data.slug.trim() === '') {
      data.slug = SlugUtil.generate(data.name);
    }

    const exists = await this.repository.findBySlug(data.slug, data.storeId);
    if (exists) {
      throw new ConflictException('Já existe uma categoria com este nome.');
    }

    try {
      const category = await this.repository.create(data);
      return ResponseHelper.success(category, 'Categoria criada com sucesso');
    } catch (error) {
      console.error('Error creating product category:', error);
      throw new BadRequestException('Não foi possível criar a categoria.');
    }
  }

  async findAll(storeId: string) {
    try {
      const store = await this.storeRepository.findById(storeId);
      if (!store) {
        throw new ConflictException(
          `Loja com o ID "${storeId}" não encontrada"`,
        );
      }
      const categories = await this.repository.findAllByStoreId(storeId);
      return ResponseHelper.success(
        categories,
        'Categorias listadas com sucesso',
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Erro ao listar categorias:', error);
      throw new BadRequestException(
        'Não foi possível listar as categorias da loja.',
      );
    }
  }

  async findOne(id: string) {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new BadRequestException('Categoria não encontrada.');
    }
    return ResponseHelper.success(category);
  }

  async update(id: string, data: UpdateProductCategoryDto) {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    if (data.slug && data.storeId) {
      const exists = await this.repository.findBySlug(data.slug, data.storeId);
      if (exists) {
        throw new ConflictException('Já existe uma categoria com este slug.');
      }
    }

    const updatedCategory = await this.repository.update(id, data);
    return ResponseHelper.success(updatedCategory);
  }

  async remove(id: string) {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    await this.repository.remove(id);
    return ResponseHelper.success(null, 'Categoria removida com sucesso');
  }

  async restore(id: string) {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    const restoredCategory = await this.repository.restore(id);
    return ResponseHelper.success(restoredCategory);
  }

  async active(id: string) {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    await this.repository.active(id);
    return ResponseHelper.success('Categoria ativada com sucesso');
  }

  async deactivate(id: string) {
    const category = await this.repository.findById(id);
    if (!category) {
      throw new BadRequestException('Categoria não encontrada.');
    }

    await this.repository.deactivate(id);
    return ResponseHelper.success('Categoria desativada com sucesso');
  }
}
