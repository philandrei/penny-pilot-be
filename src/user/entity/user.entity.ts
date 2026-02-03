import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@abstracts/abstract-entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  //set to nullable - ongoing development
  @Column({ unique: true, nullable: true })
  firebaseUid: string;

  @Column({ unique: true })
  email: string;

  @Column()
  fullName: string;

  @Column({ default: 'PHP' })
  currency: string;

  @Column({ default: true })
  isActive: boolean;
}
