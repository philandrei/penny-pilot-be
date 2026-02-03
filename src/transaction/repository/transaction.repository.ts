import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '@abstracts/abstract-repository';
import { TransactionEntity } from '../entity/transaction.entity';
import { DataSource } from 'typeorm';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { TransactionType } from '@transaction/enums/transaction.enum';

@Injectable()
export class TransactionRepository extends AbstractRepository<TransactionEntity> {
  constructor(dataSource: DataSource) {
    super(TransactionEntity, dataSource);
  }

  async getTransactionsByAccountId(
    accountId: string,
    page = 1,
    size = 10,
    filters?: {
      type?: TransactionType;
    },
  ): Promise<PaginatedResponseDto<TransactionEntity>> {
    const queryBuilder = this.createQueryBuilder('t').where(
      't.accountId=:accountId',
      { accountId },
    );
    if (filters?.type) {
      queryBuilder.andWhere('t.type = :type', { type: filters.type });
    }

    const [items, total] = await queryBuilder
      .orderBy('t.createdAt', 'DESC')
      .take(size)
      .skip((page - 1) * size)
      .getManyAndCount();

    return { items, total, page, size, totalPages: Math.ceil(total / size) };
  }
}
