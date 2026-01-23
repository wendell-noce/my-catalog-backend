import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { StoreRepository } from '../repository/store.repository';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async createStore(userId: string, createStoreDto: CreateStoreDto) {
    try {
      const existingStore = await this.storeRepository.findBySlug(
        createStoreDto.slug,
      );

      if (existingStore) {
        throw new ConflictException(
          `Já existe uma loja com o slug "${createStoreDto.slug}"`,
        );
      }

      await this.storeRepository.create(userId, createStoreDto);

      return ResponseHelper.success('Loja criada com sucesso');
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error('Erro no service ao criar loja:', error);

      throw new InternalServerErrorException(
        'Erro ao criar loja. Por favor, tente novamente.',
      );
    }
  }

  findAll() {
    return `This action returns all store`;
  }

  findById(id: string) {
    return `This action returns a #${id} store`;
  }

  findOne(id: string) {
    return `This action returns a #${id} store`;
  }

  async findBySlug(slug: string) {
    const store = await this.storeRepository.findBySlug(slug);
    if (!store) {
      throw new NotFoundException('Loja não encontrada');
    }
    return ResponseHelper.success(store);
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const store = await this.storeRepository.update(id, updateStoreDto);
    if (!store) {
      throw new NotFoundException('Loja não encontrada');
    }
    return ResponseHelper.success(
      store,
      `Loja ${store.name} atualizada com sucesso`,
    );
  }

  async remove(id: string) {
    const store = await this.storeRepository.remove(id);
    if (!store) {
      throw new NotFoundException('Loja não encontrada');
    }
    return ResponseHelper.success(store, 'Loja removida com sucesso');
  }

  async restore(id: string) {
    const store = await this.storeRepository.restore(id);
    if (!store) {
      throw new NotFoundException('Loja não encontrada');
    }
    return ResponseHelper.success(store, 'Loja restaurada com sucesso');
  }
}
