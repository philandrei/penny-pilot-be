import { BudgetPeriodEnum } from '@budget/enums/budget-period.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class BudgetRequestDto {
  @ApiProperty({
    example: 'grocery',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: '5001.00',
  })
  @IsString()
  amount: string;

  @ApiProperty({
    example: 'Example description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: BudgetPeriodEnum.MONTHLY,
  })
  @IsEnum(BudgetPeriodEnum)
  @IsOptional()
  period: BudgetPeriodEnum;

  @ApiProperty({
    example: '4501.00',
  })
  @IsOptional()
  alertThreshold?: string;

  @IsOptional()
  startDate?: Date;
  @IsOptional()
  endDate?: Date;
  @IsOptional()
  color?: string;
  @IsOptional()
  icon?: string;
}
