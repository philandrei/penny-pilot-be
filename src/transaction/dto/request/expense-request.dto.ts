import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsOptional, IsString, IsUUID } from "class-validator";

export class ExpenseRequest {

    @Expose()
    @ApiProperty({
        example: 'test description',
    })
    @IsString()
    description!: string;

    @Expose()
    @ApiProperty({
        example: '500.00',
    })
    @IsString()
    amount!: string;

    @Expose()
    @ApiProperty({
        example: '02-20-2026',
    })
    @IsString()
    date!: string;

    @Expose()
    @ApiProperty({
        example: null,
    })
    @IsUUID()
    @IsOptional()
    budgetId?: string;

    @Expose()
    @ApiProperty({
        example: null,
    })
    @IsUUID()
    categoryId!: string;

    @Expose()
    @ApiProperty({
        example: 'b672bc62-2f97-4e24-8f67-cb6354a825a9',
    })
    @IsUUID()
    accountId!: string;
}