import { BudgetRequestDto } from '@budget/dto/requests/budget-request.dto';
import { DeepPartial } from 'typeorm';
import { BudgetEntity } from '@budget/entity/budget.entity';
import { BudgetDetailDto } from '@budget/dto/responses/budget-detail.dto';
import { BudgetSummaryDto } from '@budget/dto/responses/budget-summary.dto';
import { BudgetPeriodEnum } from '@budget/enums/budget-period.enum';
import { plainToInstance } from 'class-transformer';

export class BudgetMapper {
  static toEntityFromRequest(req: BudgetRequestDto): DeepPartial<BudgetEntity> {
    let entity: DeepPartial<BudgetEntity> = plainToInstance(BudgetEntity, req, {
      excludeExtraneousValues: true
    })
    entity.period = req.period ?? BudgetPeriodEnum.MONTHLY;
    return entity;
  }

  static toDetailFromEntity(entity: BudgetEntity): BudgetDetailDto {
    return plainToInstance(BudgetDetailDto, entity, {
      excludeExtraneousValues: true
    })
  }

  static toSummaryFromEntity(entity: BudgetEntity): BudgetSummaryDto {
    return plainToInstance(BudgetSummaryDto, entity, {
      excludeExtraneousValues: true
    })
  }
}
