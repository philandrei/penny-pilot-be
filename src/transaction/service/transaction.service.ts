import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../repository/transaction.repository';
import { CreateTransactionDto } from '@transaction/dtos/request/create-transaction.dto';
import { TransactionDetailsDto } from '@transaction/dtos/response/transaction-details.dto';
import { TransactionMapper } from '@transaction/transaction.mapper';
import { TransactionType } from '@transaction/enums/transaction.enum';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { AccountService } from '@account/service/account.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly accountService: AccountService,
  ) {}

  async createCreditTransaction(
    data: CreateTransactionDto,
  ): Promise<TransactionDetailsDto> {
    return await this.createTransaction(data, TransactionType.CREDIT);
  }

  async createDebitTransaction(
    data: CreateTransactionDto,
  ): Promise<TransactionDetailsDto> {
    return await this.createTransaction(data, TransactionType.DEBIT);
  }

  private async createTransaction(
    data: CreateTransactionDto,
    transactionType: TransactionType,
  ): Promise<TransactionDetailsDto> {
    const transaction = TransactionMapper.toEntityFromRequest(data);
    transaction.type = transactionType;
    const savedTransaction = await this.repository.createEntity(transaction);

    void (await this.accountService.updateBalance(
      savedTransaction.accountId,
      savedTransaction.amount,
      transactionType,
    ));

    return TransactionMapper.toDetailFromEntity(savedTransaction);
  }

  async getTransactionsByAccountId(
    accountId: string,
    page?: number,
    size?: number,
    filters?: {
      type?: TransactionType;
    },
  ): Promise<PaginatedResponseDto<TransactionDetailsDto>> {
    return this.repository.getTransactionsByAccountId(
      accountId,
      page,
      size,
      filters,
    );
  }
}
