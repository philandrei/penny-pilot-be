import { AbstractBaseDto } from "@abstracts/abstract-base-dto";
import { RecurringFrequency } from "src/recurring/enum/recurring.enum";

export class RecurringRecord extends AbstractBaseDto {
    name!: string;
    description?: string;
    amount!: string;
    frequency!: RecurringFrequency;
    dayOfMonth?: number;
    nextRunDate!: Date;
    active!: boolean;
}