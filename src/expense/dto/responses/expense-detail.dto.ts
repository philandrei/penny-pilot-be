import { AbstractBaseDto } from '@abstracts/abstract-base-dto';

export class ExpenseDetailDto extends AbstractBaseDto {
  name: string;
  description: string;
  amount: string;
  date: Date;
  notes: string;
  userId: string;
  account: {
    uuid: string;
    name: string;
  };
  category?: {
    uuid: string;
    name: string;
  };
  budget?: {
    uuid: string;
    name: string;
  };
  transactionId: string;
}
