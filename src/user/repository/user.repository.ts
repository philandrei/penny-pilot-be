import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { UserEntity } from '../entity/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends AbstractRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource);
  }
}
