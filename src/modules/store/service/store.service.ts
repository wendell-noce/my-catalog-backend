import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from '../dto/create-store.dto';
import { StoreRepository } from '../repository/store.repository';

@Injectable()
export class StoreService {
  constructor(private readonly storeRepository: StoreRepository) {}

  async create(userId: string, createStoreDto: CreateStoreDto) {
    try {
      const existingStore = await this.storeRepository.findBySlug(
        createStoreDto.slug,
      );

      if (existingStore) {
        throw new ConflictException(
          `Já existe uma loja com o slug "${createStoreDto.slug}"`,
        );
      }

      const store = await this.storeRepository.create(userId, createStoreDto);

      return store;
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

  findByUserId(id: string) {
    return `This action returns a #${id} store`;
  }

  findByStoreId(id: string) {
    return `This action returns a #${id} store`;
  }

  findOne(id: string) {
    return `This action returns a #${id} store`;
  }

  // update(id: string, updateStoreDto: UpdateStoreDto) {
  //   return `This action updates a #${id} store`;
  // }

  remove(id: string) {
    return `This action removes a #${id} store`;
  }
}
