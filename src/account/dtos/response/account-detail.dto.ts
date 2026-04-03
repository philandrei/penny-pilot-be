import { AbstractBaseDto } from '@abstracts/abstract-base-dto';
import { AccountType } from '@account/enum/account.enum';
import { Expose } from 'class-transformer';

export class AccountDetailsDto extends AbstractBaseDto {
  @Expose()
  name!: string;

  @Expose()
  balance!: string;

  @Expose()
  isDefault!: boolean;

  @Expose()
  type!: AccountType;
}
