import { AbstractBaseDto } from '@abstracts/abstract-base-dto';

export class BudgetSummaryDto extends AbstractBaseDto {
  name: string;
  isActive: boolean;
  amount: string;
  amountSpent: string;
}
