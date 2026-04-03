import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@abstracts/abstract-entity';
import { BudgetPeriodEnum } from '../enums/budget-period.enum';
import { Expose } from 'class-transformer';
import { TransactionEntity } from '@transaction/entity/transaction.entity';

@Entity('budgets')
export class BudgetEntity extends AbstractEntity {

  @Expose()
  @Column()
  name!: string;

  @Expose()
  @Column({ nullable: true })
  userId?: string;

  @Expose()
  @Column('decimal', { precision: 10, scale: 2 })
  limitAmount!: string;

  @Expose()
  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: '0' })
  spentAmount?: string;

  @Expose()
  @Column({ nullable: true })
  description?: string;

  @Expose()
  @Column({ default: true })
  isActive!: boolean;

  @Expose()
  @Column({
    type: 'enum',
    enum: BudgetPeriodEnum,
    default: BudgetPeriodEnum.MONTHLY,
  })
  period!: BudgetPeriodEnum;

  @Expose()
  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Expose()
  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Expose()
  @Column({ nullable: true })
  color?: string;

  @Expose()
  @Column({ nullable: true })
  icon?: string;

  @Expose()
  @Column('decimal', { precision: 10, scale: 2, default: 80 })
  alertThreshold?: string;

  @OneToMany(() => TransactionEntity, (tx) => tx.budget)
  transactions?: TransactionEntity[];
}
