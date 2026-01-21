import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { ExpenseEntity } from '@expense/entity/expense.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class ExpenseRepository extends AbstractRepository<ExpenseEntity> {
  constructor(dataSource: DataSource) {
    super(ExpenseEntity, dataSource);
  }
}
