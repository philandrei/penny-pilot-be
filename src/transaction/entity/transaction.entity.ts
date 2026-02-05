import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@abstracts/abstract-entity';
import { AccountEntity } from '@account/entity/account.entity';
import { TransactionSource, TransactionType } from '../enums/transaction.enum';

@Entity('transactions')
export class TransactionEntity extends AbstractEntity {
  @Column()
  userId: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 10, scale: 2})
  oldBalance: string;

  @Column({ type: 'decimal', precision: 10, scale: 2})
  newBalance: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'enum', enum: TransactionSource })
  source: TransactionSource;

  @Column({ type: 'uuid', nullable: true })
  sourceId?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  accountId: string;

  @ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'accountId' })
  account: AccountEntity;
}
