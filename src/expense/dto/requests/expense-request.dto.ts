import { PaymentMethodEnum } from '@expense/enums/payment-method.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import moment from 'moment';

export class ExpenseRequestDto {
  @ApiProperty({
    example: 'test description',
  })
  description: string;

  @ApiProperty({
    example: '500.00',
  })
  amount: string;

  @ApiProperty({
    example: '02/20/2026',
  })
  @Transform(({ value }) => {
    const date = moment(value, 'MM/DD/YYYY', true);
    if (!date.isValid()) return null;
    return date.toDate();
  })
  date: Date;

  @ApiProperty({
    example: 'sample notes',
  })
  notes: string;

  @ApiProperty({
    example: PaymentMethodEnum.CASH,
  })
  paymentMethod: PaymentMethodEnum;
}
