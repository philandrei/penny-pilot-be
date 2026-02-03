import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './service/category.service';
import { CategoryRepository } from './repository/category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService],
})
export class CategoryModule {}
