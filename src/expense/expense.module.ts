import { Module } from '@nestjs/common';
import { ExpenseService } from '@expense/service/expense.service';
import { ExpenseController } from '@expense/expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from '@expense/entity/expense.entity';
import { BudgetModule } from '@budget/budget.module';
import { ExpenseRepository } from '@expense/repository/expense.repository';
import { TransactionModule } from '@transaction/transaction.module';
import { CategoryModule } from '@category/category.module';
import { UserModule } from '@user/user.module';
import { AccountModule } from '@account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseEntity]),
    BudgetModule,
    TransactionModule,
    CategoryModule,
    UserModule,
    AccountModule,
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseRepository],
})
export class ExpenseModule {}
