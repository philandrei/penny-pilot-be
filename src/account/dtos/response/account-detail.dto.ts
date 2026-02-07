import { AbstractBaseDto } from '@abstracts/abstract-base-dto';
import { AccountType } from '@account/enum/account.enum';

export class AccountDetailsDto extends AbstractBaseDto {
  name: string;
  balance: string;
  isDefault: boolean;
  accountType: AccountType;
}
