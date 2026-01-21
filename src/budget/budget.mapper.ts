import { BudgetRequestDto } from '@budget/dto/requests/budget-request.dto';
import { DeepPartial } from 'typeorm';
import { BudgetEntity } from '@budget/entity/budget.entity';
import { BudgetDetailDto } from '@budget/dto/responses/budget-detail.dto';
import { BudgetSummaryDto } from '@budget/dto/responses/budget-summary.dto';

export class BudgetMapper {
  static toEntityFromRequest(req: BudgetRequestDto): DeepPartial<BudgetEntity> {
    return {
      name: req.name,
      description: req.description,
      amount: req.amount,
      alertThreshold: req.alertThreshold,
      startDate: req.startDate,
      endDate: req.endDate,
      period: req.period,
    };
  }

  static toDetailFromEntity(entity: BudgetEntity): BudgetDetailDto {
    return {
      uuid: entity.uuid,
      name: entity.name,
      amount: entity.amount,
      amountSpent: entity.amountSpent,
      description: entity.description,
      isActive: entity.isActive,
      period: entity.period,
      startDate: entity.startDate,
      endDate: entity.endDate,
      color: entity.color,
      icon: entity.icon,
      alertThreshold: entity.alertThreshold,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toSummaryFromEntity(entity: BudgetEntity): BudgetSummaryDto {
    return {
      uuid: entity.uuid,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isActive: entity.isActive,
      amount: entity.amount,
      amountSpent: entity.amountSpent,
    };
  }
}
