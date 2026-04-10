import { Expose } from "class-transformer";

export class TransactionUpdateDto {
    @Expose()
    date!: Date;

    @Expose()
    amount!: string;

    @Expose()
    description!: string;

    @Expose()
    categoryId!: string;

    @Expose()
    budgetId?: string;
}