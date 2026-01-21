import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BudgetModule } from '@budget/budget.module';
import { ExpenseModule } from '@expense/expense.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    BudgetModule,
    ExpenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
