import { AbstractBaseDto } from '@abstracts/abstract-base-dto';
import { AccountType } from '@account/enum/account.enum';
import { TransactionDetailsDto } from '@transaction/dto/response/transaction-details.dto';

export class AccountDetailsDto extends AbstractBaseDto {
  name: string;
  balance: string;
  isDefault: boolean;
  accountType: AccountType;
  transactions: TransactionDetailsDto[] | undefined;
}
