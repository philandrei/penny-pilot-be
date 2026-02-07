import { TransactionSource } from '@transaction/enums/transaction.enum';

export class CreateTransactionDto {
  userId: string;
  amount: string;
  description: string;
  accountId: string;
  sourceId: string;
  source: TransactionSource;
}
