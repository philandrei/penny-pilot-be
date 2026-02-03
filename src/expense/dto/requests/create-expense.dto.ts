import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    example: 'Grab',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'test description',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: '500.00',
  })
  @IsString()
  amount: string;

  @ApiProperty({
    example: '02-20-2026',
  })
  @IsString()
  date: string;

  @ApiProperty({
    example: 'sample notes',
  })
  @IsString()
  notes: string;

  @ApiProperty({
    example: null,
  })
  @IsUUID()
  @IsOptional()
  budgetId?: string;

  @ApiProperty({
    example: null,
  })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    example: 'b672bc62-2f97-4e24-8f67-cb6354a825a9',
  })
  @IsUUID()
  accountId: string;
}
