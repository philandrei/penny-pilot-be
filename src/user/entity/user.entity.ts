import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@abstracts/abstract-entity';
import { TransactionSource } from '@transaction/enums/transaction.enum';
import { UserType } from '@user/enum/user.enum';

@Entity('users')
export class UserEntity extends AbstractEntity {
  //set to nullable - ongoing development
  @Column({ unique: true, nullable: true })
  firebaseUid: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  fullName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserType, default: UserType.LOCAL })
  userType: UserType;

  @Column({
    type: 'text',
    nullable: true,
  })
  refreshToken: string | null;
}
