import { CreateTransactionDto } from '@transaction/dtos/request/create-transaction.dto';
import { TransactionEntity } from '@transaction/entity/transaction.entity';
import { TransactionDetailsDto } from '@transaction/dtos/response/transaction-details.dto';

export class TransactionMapper {
  static toEntityFromRequest(
    data: CreateTransactionDto,
  ): Partial<TransactionEntity> {
    return {
      userId: data.userId,
      amount: data.amount,
      description: data.description,
      accountId: data.accountId,
      sourceId: data.sourceId,
      source: data.source,
    };
  }

  static toDetailFromEntity(entity: TransactionEntity): TransactionDetailsDto {
    return {
      uuid: entity.uuid,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isDeleted: entity.isDeleted,
      userId: entity.userId,
      type: entity.type,
      amount: entity.amount,
      source: entity.source,
      sourceId: entity.sourceId,
      description: entity.description,
      accountId: entity.accountId,
    };
  }
}
