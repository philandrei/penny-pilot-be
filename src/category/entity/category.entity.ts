import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@abstracts/abstract-entity';

@Entity('categories')
export class CategoryEntity extends AbstractEntity {
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  icon: string;
}
