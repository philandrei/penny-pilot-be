import { ExpenseRequestDto } from '@expense/dto/requests/expense-request.dto';
import { ExpenseEntity } from '@expense/entity/expense.entity';
import { DeepPartial } from 'typeorm';
import { ExpenseDetailDto } from '@expense/dto/responses/expense-detail.dto';
import { ExpenseSummaryDTO } from '@expense/dto/responses/expense-summary.dto';

export class ExpenseMapper {
  static toEntityFromRequest(
    request: ExpenseRequestDto,
  ): DeepPartial<ExpenseEntity> {
    return {
      description: request.description,
      date: request.date,
      paymentMethod: request.paymentMethod,
      amount: request.amount,
      notes: request.notes,
    };
  }

  static toDetailDtoFromEntity(entity: ExpenseEntity): ExpenseDetailDto {
    return {
      uuid: entity.uuid,
      amount: entity.amount,
      notes: entity.notes,
      date: entity.date,
      paymentMethod: entity.paymentMethod,
      createdAt: entity.createdAt,
      description: entity.description,
      updatedAt: entity.updatedAt,
    };
  }

  static toSummaryDtoFromEntity(entity: ExpenseEntity): ExpenseSummaryDTO {
    return {
      uuid: entity.uuid,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
      description: entity.description,
    };
  }
}
