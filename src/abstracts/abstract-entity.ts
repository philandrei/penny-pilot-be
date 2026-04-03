import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  uuid!: string;

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Expose()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Expose()
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @Expose()
  @Column({ name: 'is_deleted', default: false })
  isDeleted!: boolean;
}
