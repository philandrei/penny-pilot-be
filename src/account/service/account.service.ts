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
import { TransactionType } from '@transaction/enums/transaction.enum';

@Injectable()
export class AccountService {
  constructor(private readonly repository: AccountRepository) {}

  async updateBalance(
    accountId: string,
    amount: string,
    direction: TransactionType,
  ): Promise<AccountDetailsDto> {
    const delta =
      direction == TransactionType.CREDIT ? Number(amount) : -Number(amount);
    await this.repository.incrementAccountBalance(accountId, delta);
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
    const entity = AccountMapper.toEntityFromCreateDto(request);
    entity.userId = auth.user.uuid;
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
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<AccountDetailsDto>> {
    return this.repository.findAll(page, size).then((result) => ({
      ...result,
      items: result.items.map((item) => AccountMapper.toDetailFromEntity(item)),
    }));
  }

  async deleteAccount(uuid: string): Promise<void> {
    await this.repository.deleteById(uuid);
  }
}
