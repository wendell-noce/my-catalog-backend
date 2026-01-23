import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';
import {
  ApiActivateProductCategoryDoc,
  ApiCreateProductCategoryDoc,
  ApiDeactivateProductCategoryDoc,
  ApiDeleteProductCategoryDoc,
  ApiGetAllProductCategoriesDoc,
  ApiGetProductCategoryDoc,
  ApiRestoreProductCategoryDoc,
  ApiUpdateProductCategoryDoc,
} from '../decorator/api-docs.decorator';
import { CreateProductCategoryDto } from '../dto/create-product-category.dto';
import { UpdateProductCategoryDto } from '../dto/update-product-category.dto';
import { ProductCategoryService } from '../service/product-category.service';

@Controller('product-categories')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreateProductCategoryDoc()
  create(@Body() createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.create(createProductCategoryDto);
  }

  @Get('store/:storeId')
  @UseGuards(JwtAuthGuard)
  @ApiGetAllProductCategoriesDoc()
  findAll(@Param('storeId') storeId: string) {
    return this.productCategoryService.findAll(storeId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiGetProductCategoryDoc()
  findOne(@Param('id') id: string) {
    return this.productCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiUpdateProductCategoryDoc()
  update(
    @Param('id') id: string,
    @Body() updateProductCategoryDto: UpdateProductCategoryDto,
  ) {
    return this.productCategoryService.update(id, updateProductCategoryDto);
  }

  @Patch(':id/restore')
  @UseGuards(JwtAuthGuard)
  @ApiDeleteProductCategoryDoc()
  restore(@Param('id') id: string) {
    return this.productCategoryService.restore(id);
  }

  @Patch(':id/active')
  @UseGuards(JwtAuthGuard)
  @ApiRestoreProductCategoryDoc()
  active(@Param('id') id: string) {
    return this.productCategoryService.active(id);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  @ApiActivateProductCategoryDoc()
  deactivate(@Param('id') id: string) {
    return this.productCategoryService.deactivate(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiDeactivateProductCategoryDoc()
  remove(@Param('id') id: string) {
    return this.productCategoryService.remove(id);
  }
}
