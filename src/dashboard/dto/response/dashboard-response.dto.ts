export class DashboardResponseDto {

    summary: {
        totalBalance: number;
        totalIncomeThisMonth: number;
        totalExpenseThisMonth: number;
        remainingBudget: number;
        budgetUsagePercent: number;
    };

    expensesByCategory: {
        categoryId: string;
        categoryName: string;
        total: number;
    }[];

    monthlyTrend: {
        month: string;
        income: number;
        expense: number;
    }[];

    recentTransactions: {
        id: string;
        description: string;
        amount: number;
        date: Date;
        categoryName: string;
        type: 'INCOME' | 'EXPENSE';
    }[];

}