import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repository/transaction.repository';
import { CreateTransactionDto } from '@transaction/dto/request/create-transaction.dto';
import { TransactionDetailsDto } from '@transaction/dto/response/transaction-details.dto';
import { TransactionMapper } from '@transaction/transaction.mapper';
import { TransactionType } from '@transaction/enums/transaction.enum';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { AccountRepository } from '@account/repository/account.repository';
import { AccountEntity } from '@account/entity/account.entity';

@Injectable()
export class TransactionService {
  constructor(
    private readonly repository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  async findAllByAccountId(
    accountId: string,
    page?: number,
    size?: number,
  ): Promise<TransactionDetailsDto[]> {
    return await this.repository
      .findAll(page, size, undefined, { accountId })
      .then((data) => {
        const items = data.items;

        return items.map((item) => TransactionMapper.toDetailFromEntity(item));
      });
  }

  async createCreditTransaction(
    userId: string,
    data: CreateTransactionDto,
  ): Promise<TransactionDetailsDto> {
    return await this.createTransaction(userId, data, TransactionType.CREDIT);
  }

  async createDebitTransaction(
    userId: string,
    data: CreateTransactionDto,
  ): Promise<TransactionDetailsDto> {
    return await this.createTransaction(userId, data, TransactionType.DEBIT);
  }

  private async createTransaction(
    userId: string,
    data: CreateTransactionDto,
    transactionType: TransactionType,
  ): Promise<TransactionDetailsDto> {
    const account = await this.getAccountById(data.accountId);

    if (!account) {
      throw new NotFoundException(`Account does not exist: ${data.accountId}`);
    }
    const transaction = TransactionMapper.toEntityFromRequest(data);
    transaction.type = transactionType;
    transaction.oldBalance = account.balance;

    const savedTransaction = await this.repository.createEntity(transaction);

    const updatedAccount = await this.updateAccountBalance(
      savedTransaction.accountId,
      savedTransaction.amount,
      transactionType,
    );

    await this.repository.updateById(savedTransaction.uuid, {
      newBalance: updatedAccount.balance,
    });

    return TransactionMapper.toDetailFromEntity(savedTransaction);
  }

  private async getAccountById(uuid: string): Promise<AccountEntity> {
    return await this.accountRepository.findById(uuid).then((data) => {
      if (!data) {
        throw new NotFoundException(`Account with UUID ${uuid} not found`);
      }
      return data;
    });
  }

  private async updateAccountBalance(
    accountId: string,
    amount: string,
    direction: TransactionType,
  ): Promise<AccountEntity> {
    const delta =
      direction == TransactionType.CREDIT ? Number(amount) : -Number(amount);
    await this.accountRepository.incrementAccountBalance(accountId, delta);
    return await this.getAccountById(accountId);
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
