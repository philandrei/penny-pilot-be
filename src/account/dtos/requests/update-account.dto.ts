import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDTO {
  @ApiProperty({
    example: 'Gcash',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  balance:string;

  @ApiProperty({
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
