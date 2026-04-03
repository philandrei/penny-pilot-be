import { AbstractEntity } from '@abstracts/abstract-entity';
import { Column, Entity } from 'typeorm';
import { AccountType } from '@account/enum/account.enum';
import { Expose } from 'class-transformer';

@Entity('accounts')
export class AccountEntity extends AbstractEntity {

  @Expose()
  @Column()
  name!: string;

  @Expose()
  @Column()
  userId!: string;

  @Expose()
  @Column('decimal', { precision: 10, scale: 2 })
  balance!: string;

  @Expose()
  @Column({ default: false })
  isDefault!: boolean;

  @Expose()
  @Column({ type: 'enum', enum: AccountType, nullable: true })
  type!: AccountType;
}
