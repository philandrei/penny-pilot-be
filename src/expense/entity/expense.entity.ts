import { AbstractEntity } from '@abstracts/abstract-entity';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BudgetEntity } from '@budget/entity/budget.entity';
import { AccountEntity } from '@account/entity/account.entity';
import { CategoryEntity } from '../../category/entity/category.entity';

@Entity('expenses')
export class ExpenseEntity extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string;

  @Column({ type: 'uuid', nullable: true })
  accountId: string;

  @Column({ type: 'uuid', nullable: true })
  budgetId?: string;

  @Column({ type: 'uuid', nullable: true })
  transactionId: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;

  @ManyToOne(() => BudgetEntity, (budget) => budget.expenses, {
    nullable: true,
  })
  @JoinColumn({ name: 'budgetId' })
  budget?: BudgetEntity;
}
