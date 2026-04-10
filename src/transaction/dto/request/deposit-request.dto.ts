import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DepositRequest {
  @ApiProperty({
    example: '5000',
  })
  @IsNotEmpty()
  @IsString()
  amount!: string;

  @ApiProperty({
    example: 'Deposit from payroll',
  })
  @IsNotEmpty()
  description!: string;
}
