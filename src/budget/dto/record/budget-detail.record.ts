import { BudgetPeriodEnum } from '@budget/enums/budget-period.enum';

export class BudgetDetailRecord {
  name!: string;
  amount!: string;
  description!: string;
  isActive!: boolean;
  period!: BudgetPeriodEnum;
  startDate!: Date;
  endDate!: Date;
  color!: string;
  icon!: string;
  alertThreshold!: string;
}
