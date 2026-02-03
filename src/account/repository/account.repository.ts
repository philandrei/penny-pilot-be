import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { AccountEntity } from '../entity/account.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AccountRepository extends AbstractRepository<AccountEntity> {
  constructor(dataSource: DataSource) {
    super(AccountEntity, dataSource);
  }

  async incrementAccountBalance(uuid: string, amount: number): Promise<void> {
    await this.increment(
      {
        uuid,
      },
      'balance',
      amount,
    );
  }
}
