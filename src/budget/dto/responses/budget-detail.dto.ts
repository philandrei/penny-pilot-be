import { BudgetPeriodEnum } from '@budget/enums/budget-period.enum';
import { AbstractBaseDto } from '@abstracts/abstract-base-dto';
import { Expose } from 'class-transformer';

export class BudgetDetailDto extends AbstractBaseDto {
  @Expose()
  name: string;
  @Expose()
  limitAmount: string;
  @Expose()
  description: string;
  @Expose()
  isActive: boolean;
  @Expose()
  period: BudgetPeriodEnum;
  @Expose()
  startDate: Date;
  @Expose()
  endDate: Date;
  @Expose()
  color: string;
  @Expose()
  icon: string;
  @Expose()
  alertThreshold: string;
  @Expose()
  spentAmount: string;
}
