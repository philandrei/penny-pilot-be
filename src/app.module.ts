import { Module } from '@nestjs/common';
import { BudgetModule } from '@budget/budget.module';
import { ExpenseModule } from '@expense/expense.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { AccountModule } from '@account/account.module';
import { UserModule } from '@user/user.module';
import { TransactionModule } from '@transaction/transaction.module';
import { CategoryModule } from '@category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BudgetModule,
    ExpenseModule,
    AccountModule,
    UserModule,
    TransactionModule,
    CategoryModule,
    AuthModule,
  ],
})
export class AppModule {}
