import { BudgetRequestDto } from '@budget/dto/requests/budget-request.dto';
import { DeepPartial } from 'typeorm';
import { BudgetEntity } from '@budget/entity/budget.entity';
import { BudgetDetailDto } from '@budget/dto/responses/budget-detail.dto';
import { BudgetSummaryDto } from '@budget/dto/responses/budget-summary.dto';
import { BudgetPeriodEnum } from '@budget/enums/budget-period.enum';

export class BudgetMapper {
  static toEntityFromRequest(req: BudgetRequestDto): DeepPartial<BudgetEntity> {
    return {
      name: req.name,
      description: req.description,
      limitAmount: req.amount,
      alertThreshold: req.alertThreshold,
      startDate: req.startDate,
      endDate: req.endDate,
      period: req.period ?? BudgetPeriodEnum.MONTHLY,
    };
  }

  static toDetailFromEntity(entity: BudgetEntity): BudgetDetailDto {
    return {
      uuid: entity.uuid,
      name: entity.name,
      amount: entity.limitAmount,
      amountSpent: entity.spentAmount,
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
      isDeleted: entity.isDeleted,
    };
  }

  static toSummaryFromEntity(entity: BudgetEntity): BudgetSummaryDto {
    return {
      uuid: entity.uuid,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isActive: entity.isActive,
      amount: entity.limitAmount,
      amountSpent: entity.spentAmount,
      isDeleted: entity.isDeleted,
    };
  }
}
