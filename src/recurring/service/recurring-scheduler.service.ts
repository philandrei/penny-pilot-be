import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Between, Repository, UnorderedBulkOperation } from "typeorm";
import { RecurringEntity } from "../entity/recurring.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionMutationService } from "@transaction/service/transaction-mutation.service";
import { TransactionCategory } from "@transaction/enums/transaction.enum";
import { ExpenseRequest } from "@transaction/dto/request/expense-request.dto";
import { DepositRequest } from "@transaction/dto/request/deposit-request.dto";
import { TransferMoneyRequest } from "@account/dtos/requests/transfer-amount.dto";
import pLimit from "p-limit";
import { RecurringService } from "./recurring.service";
import { TransactionRecord } from "@transaction/dto/response/transaction-record.dto";

@Injectable()
export class RecurringSchedulerService {
    private readonly logger = new Logger(RecurringSchedulerService.name);

    constructor(
        @InjectRepository(RecurringEntity)
        private readonly repository: Repository<RecurringEntity>,
        private readonly transactionService: TransactionMutationService,
        private readonly recurringService: RecurringService) { }

    // @Cron(CronExpression.EVERY_DAY_AT_1AM)
    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleRecurringTxs() {
        const limit = pLimit(10);
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const [items, total] = await this.repository.findAndCountBy({ active: true, nextRunDate: Between(startOfDay, endOfDay) });

        this.logger.log(`Processing ${total} Recurring Records....`);

        const results = await Promise.allSettled(
            items.map(item =>
                limit(() => this.processRecurringTx(item, today))
            )
        );

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                this.logger.error(
                    `Recurring TX failed for ${items[index].uuid}`,
                    result.reason,
                );
            }
        });

    }

    private async processRecurringTx(recurringTx: RecurringEntity, today: Date) {
        this.logger.log(`Processing [id]: ${recurringTx.uuid} [category]: ${recurringTx.transactionCategory}`)
        let transactionRecord: TransactionRecord | undefined = undefined;
        if (recurringTx.transactionCategory === TransactionCategory.EXPENSE) {
            const expenseRequest: ExpenseRequest = {
                description: recurringTx.description ?? '',
                amount: recurringTx.amount,
                date: today.toDateString(),
                budgetId: undefined,
                categoryId: recurringTx.categoryId ?? '',
                accountId: recurringTx.accountId,
            };
            transactionRecord = await this.transactionService.createExpense(recurringTx.userId, expenseRequest, true);
        } else if (recurringTx.transactionCategory === TransactionCategory.DEPOSIT) {
            const depositRequest: DepositRequest = {
                amount: recurringTx.amount,
                description: recurringTx.description ?? ''
            }
            transactionRecord = await this.transactionService.deposit(recurringTx.userId, recurringTx.accountId, depositRequest, true);
        } else if (recurringTx.transactionCategory === TransactionCategory.TRANSFER) {
            const transferRequest: TransferMoneyRequest = {
                destinationAccountId: recurringTx.destinationAccountId ?? '',
                amount: recurringTx.amount
            }
            transactionRecord = await this.transactionService.transferMoney(recurringTx.userId, recurringTx.accountId, transferRequest, true);
        }
        this.logger.log(`Transaction created [uuid]:${transactionRecord?.uuid} [category]:${transactionRecord?.source}  [amount]:${transactionRecord?.amount}`)
        recurringTx.nextRunDate = this.recurringService.computeNextRunDate(recurringTx.frequency, recurringTx.dayOfWeek, recurringTx.dayOfMonth, recurringTx.nextRunDate);
        await this.repository.save(recurringTx);

    }

    private isSameDate(a: Date, b: Date): boolean {
        return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
        );
    }
}