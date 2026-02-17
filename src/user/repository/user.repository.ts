import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { UserEntity } from '../entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const qb = this.createQueryBuilder('u').where('u.email=:email', { email });

    return qb.getOne();
  }
}
