import { ApiProperty } from "@nestjs/swagger";
import { TransactionCategory } from "@transaction/enums/transaction.enum";
import { Expose } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import { RecurringFrequency } from "src/recurring/enum/recurring.enum";

export class RecurringRequest {

    @Expose()
    @ApiProperty({
        example: 'PLDT',
    })
    @IsString()
    name!: string;

    @Expose()
    @ApiProperty({
        example: 'Sample Description',
    })
    @IsString()
    @IsOptional()
    description?: string;

    @Expose()
    @ApiProperty({
        example: '2000.00',
    })
    @IsString()
    amount!: string;

    @Expose()
    @ApiProperty({
        example: 'EXPENSE',
    })
    @IsEnum(TransactionCategory)
    transactionCategory!: TransactionCategory;

    @Expose()
    @ApiProperty({
        example: 'DAILY',
    })
    @IsEnum(RecurringFrequency)
    frequency!: RecurringFrequency;

    @Expose()
    @ApiProperty({
        example: '15',
    })
    @IsNumber()
    dayOfMonth?: number;

    @Expose()
    @ApiProperty({
        example: 'Sunday',
    })
    @IsString()
    @IsOptional()
    dayOfWeek?: string;

    @Expose()
    @ApiProperty({
        example: 'categoryUuid'
    })
    @IsUUID()
    categoryId!: string;

    @Expose()
    @ApiProperty({
        example: 'accountUuid'
    })
    @IsUUID()
    accountId!: string;

    @Expose()
    @ApiProperty({
        example: 'destinationAccountUuid'
    })
    @IsUUID()
    @IsOptional()
    destinationAccountId?: string;
}