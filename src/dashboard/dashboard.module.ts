import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { AccountModule } from "@account/account.module";
import { BudgetModule } from "@budget/budget.module";
import { ExpenseModule } from "@expense/expense.module";
import { DashboardService } from "./service/dashboard.service";
import { AccountRepository } from "@account/repository/account.repository";
import { BudgetRepository } from "@budget/repository/budget.repository";
import { ExpenseRepository } from "@expense/repository/expense.repository";
import { TransactionRepository } from "@transaction/repository/transaction.repository";
import { TransactionModule } from "@transaction/transaction.module";

@Module({
    controllers: [DashboardController],
    imports: [AccountModule, BudgetModule, ExpenseModule, TransactionModule],
    providers: [DashboardService, AccountRepository, BudgetRepository, ExpenseRepository, TransactionRepository]
})
export class DashboardModule { }