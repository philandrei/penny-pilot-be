import { BudgetPeriodEnum } from '@budget/enums/budget-period.enum';
import { ApiProperty } from '@nestjs/swagger';

export class BudgetRequestDto {
  @ApiProperty({
    example: 'grocery',
  })
  name: string;

  @ApiProperty({
    example: '5001.00',
  })
  amount: string;

  @ApiProperty({
    example: 'Example description',
  })
  description: string;

  @ApiProperty({
    example: BudgetPeriodEnum.MONTHLY,
  })
  period: BudgetPeriodEnum;

  @ApiProperty({
    example: '4501.00',
  })
  alertThreshold: string;

  startDate?: Date;
  endDate?: Date;
  color?: string;
  icon?: string;
}
