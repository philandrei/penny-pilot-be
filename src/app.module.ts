import { Module } from '@nestjs/common';
import { BudgetModule } from '@budget/budget.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { AccountModule } from '@account/account.module';
import { UserModule } from '@user/user.module';
import { TransactionModule } from '@transaction/transaction.module';
import { CategoryModule } from '@category/category.module';
import { AuthModule } from '@auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from '@auth/guards/jwt.guard';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiModule } from './ai/ai.module';
import { PaginationModule } from '@common/pagination/pagination.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RecurringModule } from './recurring/recurring.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    BudgetModule,
    AccountModule,
    UserModule,
    TransactionModule,
    CategoryModule,
    AuthModule,
    DashboardModule,
    AiModule,
    PaginationModule,
    RecurringModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule { }
