import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { CategoryEntity } from '../entity/category.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CategoryRepository extends AbstractRepository<CategoryEntity> {
  constructor(dataSource: DataSource) {
    super(CategoryEntity, dataSource);
  }
}
