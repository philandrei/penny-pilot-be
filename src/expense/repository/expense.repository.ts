import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { ExpenseEntity } from '@expense/entity/expense.entity';
import { DataSource } from 'typeorm';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';

@Injectable()
export class ExpenseRepository extends AbstractRepository<ExpenseEntity> {
  constructor(dataSource: DataSource) {
    super(ExpenseEntity, dataSource);
  }

  async findExpensesByBudgetId(
    budgetId: string,
    page = 1,
    size = 10,
  ): Promise<PaginatedResponseDto<ExpenseEntity>> {
    const [items, total] = await this.findAndCount({
      where: { budget: { uuid: budgetId } },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'desc' },
    });

    return {
      items,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
}
