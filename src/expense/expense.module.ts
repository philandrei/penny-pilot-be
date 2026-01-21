import { Module } from '@nestjs/common';
import { ExpenseService } from '@expense/service/expense.service';
import { ExpenseController } from '@expense/expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from '@expense/entity/expense.entity';
import { BudgetModule } from '@budget/budget.module';
import { ExpenseRepository } from '@expense/repository/expense.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity]), BudgetModule],
  controllers: [ExpenseController],
  providers: [ExpenseService, ExpenseRepository],
})
export class ExpenseModule {}
