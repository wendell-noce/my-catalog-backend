import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ResponseHelper } from 'src/common/helpers/response.helper';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './service/store.service';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    try {
      const store = await this.storeService.create(req.user.id, createStoreDto);
      return ResponseHelper.success(store, 'Sua loja foi criada com sucesso');
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Já existe uma loja com o slug "${createStoreDto.slug}"`,
        );
      }
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Get('my-stores')
  findMyStores(@Param('id') id: string) {
    return this.storeService.findByUserId(id);
  }

  @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
  //   return this.storeService.update(id, updateStoreDto);
  // }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
