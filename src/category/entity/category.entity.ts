import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@abstracts/abstract-entity';
import { Expose } from 'class-transformer';

@Entity('categories')
export class CategoryEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'uuid' })
  userId: string;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  color: string;

  @Expose()
  @Column()
  icon: string;
}
