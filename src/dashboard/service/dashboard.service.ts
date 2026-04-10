import { AccountRepository } from "@account/repository/account.repository";
import { BudgetRepository } from "@budget/repository/budget.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "@transaction/entity/transaction.entity";
import { TransactionCategory } from "@transaction/enums/transaction.enum";
import dayjs from "dayjs";
import { Repository } from "typeorm";

@Injectable()
export class DashboardService {

    constructor(
        private accountRepo: AccountRepository,

        private budgetRepo: BudgetRepository,
        @InjectRepository(TransactionEntity)
        private transactionRepo: Repository<TransactionEntity>
    ) { }

    async getDashboard(userId: string) {

        const now = dayjs();
        const startOfMonth = now.startOf('month').toDate();
        const endOfMonth = now.endOf('month').toDate();

        const [
            totalBalance,
            totalIncome,
            totalExpense,
            totalBudget,
            expensesByCategory,
            monthlyTrend,
            recentTransactions
        ] = await Promise.all([
            this.getTotalBalance(userId),
            this.getTotalIncome(userId, startOfMonth, endOfMonth),
            this.getTotalExpense(userId, startOfMonth, endOfMonth),
            this.getRemainingBudget(userId),
            this.getExpensesByCategory(userId, startOfMonth, endOfMonth),
            this.getMonthlyTrend(userId),
            this.getRecentTransactions(userId)
        ]);

        const remainingBudget = totalBudget;

        const budgetUsagePercent =
            totalBudget === 0 ? 0 :
                Math.round((totalExpense / totalBudget) * 100);

        return {
            summary: {
                totalBalance,
                totalIncomeThisMonth: totalIncome,
                totalExpenseThisMonth: totalExpense,
                remainingBudget,
                budgetUsagePercent
            },
            expensesByCategory,
            monthlyTrend,
            recentTransactions
        };
    }

    async getTotalBalance(userId: string): Promise<number> {

        const result = await this.accountRepo
            .createQueryBuilder('account')
            .select('SUM(account.balance)', 'total')
            .where('account.userId = :userId', { userId })
            .getRawOne();

        return Number(result.total || 0);

    }

    async getTotalExpense(userId: string, start: Date, end: Date): Promise<number> {

        const result = await this.transactionRepo
            .createQueryBuilder('t')
            .select('SUM(t.amount)', 'total')
            .where('t.userId = :userId', { userId })
            .andWhere('t.source = :source', { source: TransactionCategory.EXPENSE })
            .andWhere('t.createdAt BETWEEN :start AND :end', { start, end })
            .getRawOne();

        return Number(result.total || 0);
    }

    async getExpensesByCategory(userId: string, start: Date, end: Date) {
        const source = TransactionCategory.EXPENSE;
        return this.transactionRepo
            .createQueryBuilder('transaction')
            .leftJoin('transaction.category', 'category')
            .select('category.uuid', 'categoryId')
            .addSelect('category.name', 'categoryName')
            .addSelect('SUM(transaction.amount)', 'total')
            .where('transaction.userId = :userId', { userId })
            .andWhere('transaction.date BETWEEN :start AND :end', { start, end })
            .andWhere('transaction.source = :source', { source })
            .groupBy('category.uuid')
            .addGroupBy('category.name')
            .getRawMany();

    }
    async getMonthlyTrend(userId: string) {

        return this.transactionRepo
            .createQueryBuilder('t')
            .select("TO_CHAR(t.createdAt, 'YYYY-MM')", 'month')
            .addSelect("SUM(CASE WHEN t.source = 'INCOME' THEN t.amount ELSE 0 END)", 'income')
            .addSelect("SUM(CASE WHEN t.source = 'EXPENSE' THEN t.amount ELSE 0 END)", 'expense')
            .where('t.userId = :userId', { userId })
            .groupBy("TO_CHAR(t.createdAt, 'YYYY-MM')")
            .orderBy("month", "ASC")
            .getRawMany();

    }

    async getRecentTransactions(userId: string) {
        const source = TransactionCategory.EXPENSE;

        return this.transactionRepo
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.category', 'category')
            .where('transaction.userId = :userId', { userId })
            .andWhere('transaction.source = :source', { source })
            .orderBy('transaction.date', 'DESC')
            .limit(10)
            .getMany();

    }

    async getTotalIncome(userId: string, start: Date, end: Date): Promise<number> {

        const result = await this.transactionRepo
            .createQueryBuilder('t')
            .select('SUM(t.amount)', 'total')
            .where('t.userId = :userId', { userId })
            .andWhere('t.source = :source', { source: TransactionCategory.DEPOSIT })
            .andWhere('t.createdAt BETWEEN :start AND :end', { start, end })
            .getRawOne();

        return Number(result.total || 0);
    }

    async getRemainingBudget(userId: string): Promise<number> {

        const today = new Date();

        const result = await this.budgetRepo
            .createQueryBuilder('budget')
            .select('SUM(budget.limitAmount - budget.spentAmount)', 'total')
            .where('budget.userId = :userId', { userId })
            // .andWhere(':today BETWEEN budget.startDate AND budget.endDate', {
            //     today
            // })
            .getRawOne();

        return Number(result.total || 0);

    }
}