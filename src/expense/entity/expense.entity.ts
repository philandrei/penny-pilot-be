import { AbstractEntity } from '@abstracts/abstract-entity';
import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BudgetEntity } from '@budget/entity/budget.entity';

@Entity('expenses')
export class ExpenseEntity extends AbstractEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  notes: string;

  @Column({
    type: 'enum',
    enum: PaymentMethodEnum,
    default: PaymentMethodEnum.CASH,
  })
  paymentMethod: PaymentMethodEnum;

  @ManyToOne(() => BudgetEntity, (budget) => budget.expenses, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'budgetId' })
  budget: BudgetEntity;
}
