import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PASSWORD_REGEX } from '@common/constants/regex.constant';

export class RegistrationDto {
  @ApiProperty({
    example: 'chichaymonkey@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Chichaymonkey02!@',
  })
  @IsOptional()
  @IsString()
  @MinLength(12)
  @MaxLength(64)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  })
  password: string;

  @ApiProperty({
    example: 'Chichay Monkey',
  })
  @IsNotEmpty()
  fullName: string;
}
