import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Food',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'blue',
  })
  @IsString()
  color: string;

  @ApiProperty({
    example: 'dragon',
  })
  @IsString()
  icon: string;
}
