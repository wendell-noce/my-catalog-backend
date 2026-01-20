import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import { ApiCreateStore } from './decorators/api-docs.decorator';
import { CreateStoreDto } from './dto/create-store.dto';
import { StoreService } from './service/store.service';

@ApiTags('Stores')
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiCreateStore()
  async create(@Req() req, @Body() createStoreData: CreateStoreDto) {
    return await this.storeService.createStore(req.user.id, createStoreData);
  }

  @Get('slug/:slug')
  @UseGuards(JwtAuthGuard)
  findBySlug(@Param('slug') slug: string) {
    return this.storeService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateStoreDto: any) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  restore(@Param('id') id: string) {
    return this.storeService.restore(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
