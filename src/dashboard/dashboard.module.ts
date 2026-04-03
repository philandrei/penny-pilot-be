import { Module } from "@nestjs/common";
import { DashboardController } from "./dashboard.controller";
import { AccountModule } from "@account/account.module";
import { BudgetModule } from "@budget/budget.module";
import { DashboardService } from "./service/dashboard.service";
import { AccountRepository } from "@account/repository/account.repository";
import { BudgetRepository } from "@budget/repository/budget.repository";
import { TransactionModule } from "@transaction/transaction.module";

@Module({
    controllers: [DashboardController],
    imports: [AccountModule, BudgetModule, TransactionModule],
    providers: [DashboardService, AccountRepository, BudgetRepository]
})
export class DashboardModule { }