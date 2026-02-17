import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Rocky Buffy',
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'buffy_rocky@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
