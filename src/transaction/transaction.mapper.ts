import { TransactionEntity } from '@transaction/entity/transaction.entity';
import { TransactionRecord } from './dto/response/transaction-record.dto';
import { plainToInstance } from 'class-transformer';
import { ExpenseRequest } from './dto/request/expense-request.dto';
import { TransactionUpdateDto } from './dto/request/transaction-update.dto';

export class TransactionMapper {
  static toRecordFromEntity(entity: TransactionEntity): TransactionRecord {
    return plainToInstance(TransactionRecord, entity, {
      excludeExtraneousValues: true
    })
  }

  static toUpdateDtoFromExpense(request: ExpenseRequest): TransactionUpdateDto {
    return plainToInstance(TransactionUpdateDto, request, {
      excludeExtraneousValues: true
    })
  }
}
