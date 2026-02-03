import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
