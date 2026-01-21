import { BudgetPeriodEnum } from '@budget/enums/budget-period.enum';
import { AbstractBaseDto } from '@abstracts/abstract-base-dto';

export class BudgetDetailDto extends AbstractBaseDto {
  name: string;
  amount: string;
  description: string;
  isActive: boolean;
  period: BudgetPeriodEnum;
  startDate: Date;
  endDate: Date;
  color: string;
  icon: string;
  alertThreshold: string;
  amountSpent:string;
  // expenses: ExpenseEntity[];
}
