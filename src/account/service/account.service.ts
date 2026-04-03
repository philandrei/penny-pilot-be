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
import { PaginatedResponseDto } from '@common/pagination/paginated-response.dto';
import { isUUID } from 'class-validator';
import { TransactionType } from '@transaction/enums/transaction.enum';
import { AccountType } from '@account/enum/account.enum';
import { EntityManager } from 'typeorm';
import Decimal from 'decimal.js';

@Injectable()
export class AccountService {
  constructor(
    private readonly repository: AccountRepository,
    // private readonly transactionService: TransactionService,
  ) { }

  async creditBalance(manager: EntityManager, userId: string, accountId: string, amount: string): Promise<{ oldBalance, newBalance }> {
    return await this.updateAccountBalance(manager, userId, accountId, amount, TransactionType.CREDIT);
  }

  async debitBalance(manager: EntityManager, userId: string, accountId: string, amount: string): Promise<{ oldBalance, newBalance }> {
    return await this.updateAccountBalance(manager, userId, accountId, amount, TransactionType.DEBIT);
  }

  private async updateAccountBalance(
    manager: EntityManager,
    userId: string,
    accountId: string,
    amount: string,
    direction: TransactionType,
  ): Promise<{ oldBalance, newBalance }> {
    const accountRepo = manager.getRepository(AccountEntity);

    const account = await accountRepo.findOne({
      where: { uuid: accountId, userId },
      lock: { mode: 'pessimistic_write' }
    })

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const oldBalance = new Decimal(account.balance);
    const amt = new Decimal(amount);

    const newBalance =
      direction === TransactionType.CREDIT
        ? oldBalance.plus(amt)
        : oldBalance.minus(amt);

    if (newBalance.isNegative()) {
      throw new BadRequestException('Insufficient balance');
    }

    account.balance = newBalance.toFixed(2);

    await accountRepo.save(account);

    return { oldBalance, newBalance };
  }

  async findByName(userId: string, name: string): Promise<AccountEntity | null> {
    return await this.repository.findOne({
      where: { userId, name },
    });
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
    userId: string,
    request: CreateAccountDto,
  ): Promise<AccountDetailsDto> {
    await this.findByName(userId, request.name).then((data) => {
      if (data) throw new BadRequestException('Account name already exists');
    });

    const entity = AccountMapper.toEntityFromCreateDto(request);
    entity.userId = userId;

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

  async getAccountById(
    userId: string,
    uuid: string,
  ): Promise<AccountDetailsDto> {
    return await this.repository.findOneBy({ uuid, userId }).then((data) => {
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
