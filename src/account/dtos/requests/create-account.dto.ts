import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '@account/enum/account.enum';

export class CreateAccountDto {
  @ApiProperty({
    example: 'Seabank',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '7000',
  })
  @IsNotEmpty()
  @IsString()
  balance: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({
    example: AccountType.DEBIT_CARD,
  })
  @IsNotEmpty()
  @IsEnum(AccountType)
  accountType: AccountType;
}
