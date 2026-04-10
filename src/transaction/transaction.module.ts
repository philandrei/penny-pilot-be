import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@transaction/entity/transaction.entity';
import { TransactionController } from '@transaction/controller/transaction.controller';
import { AccountModule } from '@account/account.module';
import { UserModule } from '@user/user.module';
import { CategoryModule } from '@category/category.module';
import { BudgetModule } from '@budget/budget.module';
import { TransactionQueryService } from './service/transaction-query.service';
import { TransactionMutationService } from './service/transaction-mutation.service';
import { ExpenseController } from './controller/expense.controller';

@Module({
  controllers: [TransactionController, ExpenseController],
  providers: [TransactionQueryService, TransactionMutationService],
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    AccountModule,
    UserModule,
    CategoryModule,
    BudgetModule
  ],
  exports: [TypeOrmModule, TransactionMutationService]
})
export class TransactionModule { }
