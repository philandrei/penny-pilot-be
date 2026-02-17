import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountRepository } from '@account/repository/account.repository';
import { CreateAccountDto } from '@account/dtos/requests/create-account.dto';
import { AccountDetailsDto } from '@account/dtos/response/account-detail.dto';
import { AccountMapper } from '@account/account.mapper';
import { UpdateAccountDTO } from '@account/dtos/requests/update-account.dto';
import { AccountEntity } from '@account/entity/account.entity';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { AuthenticatedRequest } from '../../auth/auth-request.interface';
import { isUUID } from 'class-validator';
import { TransactionSource } from '@transaction/enums/transaction.enum';
import { AccountType } from '@account/enum/account.enum';
import { TransactionService } from '@transaction/service/transaction.service';
import { AccountDepositDto } from '@account/dtos/requests/account-deposit.dto';
import { CreateTransactionDto } from '@transaction/dto/request/create-transaction.dto';
import { TransferAmountDto } from '@account/dtos/requests/transfer-amount.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly repository: AccountRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async getAccountTransactions(
    accountId: string,
    page?: number,
    size?: number,
  ): Promise<AccountDetailsDto> {
    const account = await this.getAccountById(accountId);

    if (!account) {
      throw new NotFoundException('Account does not exist');
    }

    account.transactions = await this.transactionService.findAllByAccountId(
      accountId,
      page,
      size,
    );

    return account;
  }

  async transferAmount(
    userId: string,
    accountId: string,
    data: TransferAmountDto,
  ): Promise<AccountDetailsDto> {
    const sourceAccount: AccountEntity = await this.getAccountEntityById(
      accountId,
    ).then((data) => {
      if (!data) {
        throw new NotFoundException('Account ID does not exist');
      }

      if (data.type === AccountType.CREDIT_CARD) {
        throw new BadRequestException(
          'Credit card should not transfer amount.',
        );
      }
      return data;
    });

    const destinationAccount: AccountEntity = await this.getAccountEntityById(
      data.destinationAccountId,
    ).then((data) => {
      if (!data) {
        throw new NotFoundException("Destination account doesn't exist");
      }
      if (data.type === AccountType.CREDIT_CARD) {
        throw new BadRequestException(
          'Destination account should not be a Credit card',
        );
      }
      return data;
    });

    //debit first to the sourceAccount
    const debitTx: CreateTransactionDto = {
      amount: data.amount,
      accountId: sourceAccount.uuid,
      userId,
      sourceId: sourceAccount.uuid,
      source: TransactionSource.TRANSFER,
      description: 'Transfer amount to ' + destinationAccount.uuid,
    };

    await this.transactionService.createDebitTransaction(debitTx);

    //credit the amount to destination account
    const creditTx: CreateTransactionDto = {
      amount: data.amount,
      accountId: destinationAccount.uuid,
      userId,
      sourceId: sourceAccount.uuid,
      source: TransactionSource.RECEIVE,
      description: 'Receive amount from ' + sourceAccount.uuid,
    };

    await this.transactionService.createCreditTransaction(creditTx);

    return await this.getAccountById(sourceAccount.uuid);
  }

  async findByName(name: string): Promise<AccountEntity | null> {
    return await this.repository.findOne({
      where: { name },
    });
  }

  async accountDeposit(
    auth: AuthenticatedRequest,
    accountId: string,
    data: AccountDepositDto,
  ): Promise<AccountDetailsDto> {
    const account = await this.getAccountById(accountId);
    if (account.accountType === AccountType.CREDIT_CARD) {
      throw new BadRequestException(
        'Deposits are not allowed for credit card accounts',
      );
    }

    const tx: CreateTransactionDto = {
      amount: data.amount,
      accountId,
      userId: auth.user.userId,
      sourceId: accountId,
      source: TransactionSource.DEPOSIT,
      description: data.description,
    };

    await this.transactionService.createCreditTransaction(tx);

    return this.getAccountById(accountId);
  }

  async clearCreditCardBalance(
    auth: AuthenticatedRequest,
    accountId: string,
  ): Promise<AccountDetailsDto> {
    const account = await this.getAccountById(accountId);

    if (account.accountType !== AccountType.CREDIT_CARD) {
      throw new BadRequestException('Account is not a credit card');
    }

    const tx: CreateTransactionDto = {
      amount: account.balance,
      accountId,
      userId: auth.user.userId,
      sourceId: accountId,
      source: TransactionSource.CREDIT_RESET,
      description: 'Credit card statement paid',
    };

    await this.transactionService.createDebitTransaction(tx);

    return await this.getAccountById(accountId);
  }

  async validateAccountId(uuid: string): Promise<void> {
    if (!isUUID(uuid)) {
      throw new BadRequestException('Invalid accountId');
    }

    // 2. Existence
    const account = await this.repository.findOneBy({ uuid: uuid });
    if (!account) {
      throw new NotFoundException('Account not found');
    }
  }

  async getAccountEntityById(uuid: string): Promise<AccountEntity | null> {
    return await this.repository.findById(uuid);
  }

  async createAccount(
    auth: AuthenticatedRequest,
    request: CreateAccountDto,
  ): Promise<AccountDetailsDto> {
    await this.findByName(request.name).then((data) => {
      if (data) throw new BadRequestException('Account name already exists');
    });

    const entity = AccountMapper.toEntityFromCreateDto(request);
    entity.userId = auth.user.userId;

    if (request.accountType === AccountType.CREDIT_CARD) {
      entity.balance = '0';
    }

    return await this.repository
      .createEntity(entity)
      .then((data) => AccountMapper.toDetailFromEntity(data));
  }

  async updateAccount(
    uuid: string,
    request: UpdateAccountDTO,
  ): Promise<AccountDetailsDto> {
    const entity = AccountMapper.toEntityFromUpdateDto(request);
    return await this.repository.updateById(uuid, entity).then((data) => {
      if (!data) {
        throw new NotFoundException(`Account with UUID ${uuid} not found`);
      }
      return AccountMapper.toDetailFromEntity(data);
    });
  }

  async getAccountById(uuid: string): Promise<AccountDetailsDto> {
    return await this.repository.findById(uuid).then((data) => {
      if (!data) {
        throw new NotFoundException(`Account with UUID ${uuid} not found`);
      }
      return AccountMapper.toDetailFromEntity(data);
    });
  }

  async getAccounts(
    userId: string,
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<AccountDetailsDto>> {
    return this.repository
      .findAll(page, size, undefined, { userId })
      .then((result) => ({
        ...result,
        items: result.items.map((item) =>
          AccountMapper.toDetailFromEntity(item),
        ),
      }));
  }

  async deleteAccount(uuid: string): Promise<void> {
    await this.repository.deleteById(uuid);
  }
}
