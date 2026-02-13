import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferAmountDto {
  @ApiProperty({
    example: 'destinationAccountId',
  })
  @IsNotEmpty()
  @IsString()
  destinationAccountId: string;

  @ApiProperty({
    example: '20',
  })
  @IsNotEmpty()
  @IsString()
  amount: string;
}
