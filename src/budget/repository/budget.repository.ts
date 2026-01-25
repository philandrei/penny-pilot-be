import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { DataSource } from 'typeorm';
import { BudgetEntity } from '@budget/entity/budget.entity';

@Injectable()
export class BudgetRepository extends AbstractRepository<BudgetEntity> {
  constructor(dataSource: DataSource) {
    super(BudgetEntity, dataSource);
  }

  async sumExpensesByBudgetId(
    uuid: string,
  ): Promise<string | null | undefined> {
    const result = await this.createQueryBuilder('b')
      .select('SUM(e.amount)', 'totalAmount')
      .innerJoin('b.expenses', 'e')
      .where('b.uuid = :uuid', { uuid })
      .getRawOne<{ totalAmount: string | null }>();

    return result?.totalAmount;
  }
}
