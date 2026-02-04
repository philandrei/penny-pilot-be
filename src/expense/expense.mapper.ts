import { CreateExpenseDto } from '@expense/dto/requests/create-expense.dto';
import { ExpenseEntity } from '@expense/entity/expense.entity';
import { DeepPartial } from 'typeorm';
import { ExpenseDetailDto } from '@expense/dto/responses/expense-detail.dto';
import { ExpenseSummaryDTO } from '@expense/dto/responses/expense-summary.dto';

export class ExpenseMapper {
  static toEntityFromRequest(
    request: CreateExpenseDto,
  ): DeepPartial<ExpenseEntity> {
    return {
      name: request.name,
      description: request.description,
      date: request.date,
      amount: request.amount,
      budgetId: request.budgetId,
      accountId: request.accountId,
      categoryId: request.categoryId,
    };
  }

  static toDetailDtoFromEntity(entity: ExpenseEntity): ExpenseDetailDto {
    return {
      uuid: entity.uuid,
      name: entity.name,
      amount: entity.amount,
      date: entity.date,
      createdAt: entity.createdAt,
      description: entity.description,
      updatedAt: entity.updatedAt,
      isDeleted: entity.isDeleted,
      userId: entity.userId,
      transactionId: entity.transactionId,
      budget: entity.budget
        ? {
            name: entity.budget.name,
            uuid: entity.budget.uuid,
          }
        : undefined,
      account: {
        uuid: entity.account?.uuid,
        name: entity.account?.name,
      },
      category: entity.category
        ? {
            uuid: entity.category.uuid,
            name: entity.category.name,
          }
        : undefined,
    };
  }

  static toSummaryDtoFromEntity(entity: ExpenseEntity): ExpenseSummaryDTO {
    return {
      uuid: entity.uuid,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
      description: entity.description,
      isDeleted: entity.isDeleted,
    };
  }
}
