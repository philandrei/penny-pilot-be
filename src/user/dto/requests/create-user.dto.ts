import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@user/enum/user.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'phlomenon20@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'chichaymonkey',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(12)
  @MaxLength(64)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    },
  )
  password?: string;

  @ApiProperty({
    example: 'Chichay Monkey',
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'LOCAL',
  })
  userType: UserType;
}
