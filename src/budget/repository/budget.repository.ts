import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { DataSource } from 'typeorm';
import { BudgetEntity } from '@budget/entity/budget.entity';

@Injectable()
export class BudgetRepository extends AbstractRepository<BudgetEntity> {
  constructor(dataSource: DataSource) {
    super(BudgetEntity, dataSource);
  }
}
