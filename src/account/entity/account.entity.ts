import { AbstractEntity } from '@abstracts/abstract-entity';
import { Column, Entity } from 'typeorm';

@Entity('accounts')
export class AccountEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  balance: string;

  @Column({ default: false })
  isDefault: boolean;
}
