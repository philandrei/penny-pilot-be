import { Module } from '@nestjs/common';
import { BudgetController } from '@budget/budget.controller';
import { BudgetService } from '@budget/service/budget.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BudgetEntity } from '@budget/entity/budget.entity';
import { BudgetRepository } from '@budget/repository/budget.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BudgetEntity])],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRepository],
  exports: [BudgetService],
})
export class BudgetModule {}
