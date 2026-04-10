import { AbstractBaseDto } from '@abstracts/abstract-base-dto';
import { AccountEntity } from '@account/entity/account.entity';
import { BudgetEntity } from '@budget/entity/budget.entity';
import { CategoryEntity } from '@category/entity/category.entity';
import {
  TransactionCategory,
  TransactionType,
} from '@transaction/enums/transaction.enum';
import { Expose } from 'class-transformer';

export class TransactionRecord extends AbstractBaseDto {
  @Expose()
  userId: string;
  @Expose()
  type: TransactionType;
  @Expose()
  amount: string;
  @Expose()
  source: TransactionCategory;
  @Expose()
  description?: string;
  @Expose()
  date: Date;
  @Expose()
  sourceId?: string;
  @Expose()
  destinationId?: string;
  @Expose()
  account: AccountEntity;
  @Expose()
  budget: BudgetEntity;
  @Expose()
  category: CategoryEntity;
}
