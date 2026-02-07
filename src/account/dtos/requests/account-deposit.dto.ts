import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountDepositDto {
  @ApiProperty({
    example: '5000',
  })
  @IsNotEmpty()
  @IsString()
  amount: string;

  @ApiProperty({
    example: 'Deposit from payroll',
  })
  @IsNotEmpty()
  description: string;
}
