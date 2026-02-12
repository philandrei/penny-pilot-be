import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccountType } from '@account/enum/account.enum';

export class UpdateAccountDTO {
  @ApiProperty({
    example: 'Gcash',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: true,
  })
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
