import { CreateAccountDto } from './dtos/requests/create-account.dto';
import { AccountEntity } from './entity/account.entity';
import { AccountDetailsDto } from '@account/dtos/response/account-detail.dto';
import { UpdateAccountDTO } from '@account/dtos/requests/update-account.dto';
import { plainToInstance } from 'class-transformer';

export class AccountMapper {
  static toEntityFromCreateDto(req: CreateAccountDto): Partial<AccountEntity> {
    return {
      name: req.name,
      balance: req.balance,
      isDefault: req.isDefault,
      type: req.accountType,
    };
  }

  static toEntityFromUpdateDto(req: UpdateAccountDTO): Partial<AccountEntity> {
    return {
      name: req.name,
      type: req.accountType,
      isDefault: req.isDefault,
    };
  }

  static toDetailFromEntity(entity: AccountEntity): AccountDetailsDto {
    return plainToInstance(AccountDetailsDto, entity, {
      excludeExtraneousValues: true
    })
  }
}
