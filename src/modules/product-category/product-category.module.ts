import { Module } from '@nestjs/common';
import { StoreModule } from '../store/store.module';
import { ProductCategoryController } from './controller/product-category.controller';
import { ProductCategoryRepository } from './repository/product-category.repository';
import { ProductCategoryService } from './service/product-category.service';

@Module({
  imports: [StoreModule],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService, ProductCategoryRepository],
})
export class ProductCategoryModule {}
