import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@abstracts/abstract-entity';
import { AccountEntity } from '@account/entity/account.entity';
import { TransactionCategory, TransactionOrigin, TransactionStatus, TransactionType } from '../enums/transaction.enum';
import { CategoryEntity } from '@category/entity/category.entity';
import { BudgetEntity } from '@budget/entity/budget.entity';

@Entity('transactions')
export class TransactionEntity extends AbstractEntity {
  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Column({ type: 'date', nullable: true })
  date?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  oldBalance!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  newBalance!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: string;

  @Column({ type: 'enum', enum: TransactionCategory })
  source!: TransactionCategory;

  @Column({ type: 'enum', enum: TransactionOrigin, default: TransactionOrigin.MANUAL })
  origin!: TransactionOrigin;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.POSTED })
  status!: TransactionStatus;

  @Column({ type: 'uuid', nullable: true })
  sourceId?: string;

  @Column({ type: 'uuid', nullable: true })
  destinationId?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  categoryId?: string;

  @Column({ type: 'uuid', nullable: true })
  accountId!: string;

  @Column({ type: 'uuid', nullable: true })
  budgetId?: string;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category?: CategoryEntity;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account?: AccountEntity;

  @ManyToOne(() => BudgetEntity, (budget) => budget.transactions, {
    nullable: true,
  })
  @JoinColumn({ name: 'budgetId' })
  budget?: BudgetEntity;
}
