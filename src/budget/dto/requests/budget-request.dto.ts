import { BudgetPeriodEnum } from '@budget/enums/budget-period.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class BudgetRequestDto {

  @Expose()
  @ApiProperty({
    example: 'grocery',
  })
  @IsString()
  name: string;

  @Expose()
  @ApiProperty({
    example: '5001.00',
  })
  @IsString()
  limitAmount: string;

  @Expose()
  @ApiProperty({
    example: 'Example description',
  })
  @IsString()
  description: string;

  @Expose()
  @ApiProperty({
    example: BudgetPeriodEnum.MONTHLY,
  })
  @IsEnum(BudgetPeriodEnum)
  @IsOptional()
  period: BudgetPeriodEnum;

  @Expose()
  @ApiProperty({
    example: '4501.00',
  })
  @IsOptional()
  alertThreshold?: string;

  @Expose()
  @IsOptional()
  startDate?: Date;

  @Expose()
  @IsOptional()

  @Expose()
  endDate?: Date;

  @Expose()
  @IsOptional()
  color?: string;

  @Expose()
  @IsOptional()
  icon?: string;
}
