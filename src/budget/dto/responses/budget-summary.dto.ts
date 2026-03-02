import { AbstractBaseDto } from '@abstracts/abstract-base-dto';
import { Expose } from 'class-transformer';

export class BudgetSummaryDto extends AbstractBaseDto {
  @Expose()
  name: string;
  @Expose()
  isActive: boolean;
  @Expose()
  limitAmount: string;
  @Expose()
  spentAmount: string;
}
