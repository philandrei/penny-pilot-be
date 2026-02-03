import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@abstracts/abstract-entity';
import { BudgetPeriodEnum } from '../enums/budget-period.enum';
import { ExpenseEntity } from '@expense/entity/expense.entity';

@Entity('budgets')
export class BudgetEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  limitAmount: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, default: '0' })
  spentAmount: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: BudgetPeriodEnum,
    default: BudgetPeriodEnum.MONTHLY,
  })
  period: BudgetPeriodEnum;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  icon: string;

  @Column('decimal', { precision: 10, scale: 2, default: 80 })
  alertThreshold: string;

  @OneToMany(() => ExpenseEntity, (expense) => expense.budget)
  expenses: ExpenseEntity[];
}
