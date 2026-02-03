import { AbstractBaseDto } from '@abstracts/abstract-base-dto';
import {
  TransactionSource,
  TransactionType,
} from '@transaction/enums/transaction.enum';

export class TransactionDetailsDto extends AbstractBaseDto {
  userId: string;
  type: TransactionType;
  amount: string;
  source: TransactionSource;
  sourceId?: string;
  description?: string;
  accountId: string;
}
