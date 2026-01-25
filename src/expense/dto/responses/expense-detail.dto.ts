import { PaymentMethodEnum } from '@expense/enums/payment-method.enum';
import { AbstractBaseDto } from '@abstracts/abstract-base-dto';

export class ExpenseDetailDto extends AbstractBaseDto {
  name: string;
  description: string;
  amount: string;
  date: Date;
  notes: string;
  paymentMethod: PaymentMethodEnum;
}
