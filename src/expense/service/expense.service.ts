import { Injectable, NotFoundException } from '@nestjs/common';
import { ExpenseRepository } from '@expense/repository/expense.repository';
import { ExpenseRequestDto } from '@expense/dto/requests/expense-request.dto';
import { ExpenseDetailDto } from '@expense/dto/responses/expense-detail.dto';
import { ExpenseMapper } from '@expense/expense.mapper';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { ExpenseSummaryDTO } from '@expense/dto/responses/expense-summary.dto';
import { BudgetService } from '@budget/service/budget.service';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly repository: ExpenseRepository,
    private readonly budgetService: BudgetService,
  ) {}

  async createExpense(
    budgetId: string,
    request: ExpenseRequestDto,
  ): Promise<ExpenseDetailDto> {
    const budget = await this.budgetService.findEntityByUuid(budgetId);
    if (!budget) {
      throw new NotFoundException(`Budget with UUID ${budgetId} not found`);
    }

    const expense = ExpenseMapper.toEntityFromRequest(request);
    expense.budget = budget;

    const savedExpense = await this.repository.createEntity(expense);

    // async call for updating the budget amountSpent
    void (await this.budgetService.updateAmountSpent(budgetId));

    return ExpenseMapper.toDetailDtoFromEntity(savedExpense);
  }

  async updateExpense(
    uuid: string,
    request: ExpenseRequestDto,
  ): Promise<ExpenseDetailDto> {
    const expense = ExpenseMapper.toEntityFromRequest(request);

    return await this.repository.updateById(uuid, expense).then((data) => {
      if (!data) {
        throw new NotFoundException(`Expense with UUID ${uuid} not found`);
      }
      // async call for updating the budget amountSpent
      void this.budgetService.updateAmountSpent(data.budget.uuid);
      return ExpenseMapper.toDetailDtoFromEntity(data);
    });
  }

  async findByUuid(uuid: string): Promise<ExpenseDetailDto> {
    return this.repository.findById(uuid).then((data) => {
      if (!data) {
        throw new NotFoundException(`Expense with UUID ${uuid} not found`);
      }
      return ExpenseMapper.toDetailDtoFromEntity(data);
    });
  }

  async getExpenses(
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<ExpenseSummaryDTO>> {
    return this.repository.findAll(page, size).then((result) => ({
      ...result,
      items: result.items.map((item) =>
        ExpenseMapper.toSummaryDtoFromEntity(item),
      ),
    }));
  }

  async deleteExpense(uuid: string): Promise<void> {
    const expense = await this.repository.findById(uuid);
    if (expense) {
      const budgetId = expense.budget.uuid;
      await this.repository.deleteById(uuid);
      void (await this.budgetService.updateAmountSpent(budgetId));
    }
  }

  async getExpensesByBudgetId(
    budgetId: string,
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<ExpenseDetailDto>> {
    return this.repository
      .findExpensesByBudgetId(budgetId, page, size)
      .then((result) => ({
        ...result,
        items: result.items.map((item) =>
          ExpenseMapper.toDetailDtoFromEntity(item),
        ),
      }));
  }
}
