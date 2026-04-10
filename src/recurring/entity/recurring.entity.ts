import { AbstractEntity } from "@abstracts/abstract-entity";
import { Column, Entity } from "typeorm";
import { RecurringFrequency } from "../enum/recurring.enum";
import { TransactionCategory } from "@transaction/enums/transaction.enum";

@Entity('recurring')
export class RecurringEntity extends AbstractEntity {

    @Column()
    userId!: string;

    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: true })
    description?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount!: string;

    @Column({ type: 'enum', enum: TransactionCategory })
    transactionCategory!: TransactionCategory;

    @Column({ type: 'enum', enum: RecurringFrequency })
    frequency!: RecurringFrequency;

    @Column({ nullable: true })
    dayOfMonth?: number; // e.g. 15

    @Column({ nullable: true })
    dayOfWeek?: number; // 0 (Sun) - 6 (Sat) for weekly

    @Column()
    nextRunDate!: Date;

    @Column({ default: true })
    active!: boolean;

    @Column({ type: 'uuid', nullable: true })
    categoryId?: string;

    @Column({ type: 'uuid' })
    accountId!: string;

    @Column({ type: 'uuid', nullable: true })
    destinationAccountId?: string;

}