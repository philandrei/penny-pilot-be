import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ExpenseRepository } from '@expense/repository/expense.repository';
import { CreateExpenseDto } from '@expense/dto/requests/create-expense.dto';
import { ExpenseDetailDto } from '@expense/dto/responses/expense-detail.dto';
import { ExpenseMapper } from '@expense/expense.mapper';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { BudgetService } from '@budget/service/budget.service';
import { AuthenticatedRequest } from '../../auth/auth-request.interface';
import { AccountService } from '@account/service/account.service';
import { TransactionService } from '@transaction/service/transaction.service';
import { CategoryService } from '@category/service/category.service';
import { TransactionSource } from '@transaction/enums/transaction.enum';
import { ExpenseEntity } from '@expense/entity/expense.entity';
import { TransactionDetailsDto } from '@transaction/dto/response/transaction-details.dto';
import { AccountType } from '@account/enum/account.enum';
import { CreateTransactionDto } from '@transaction/dto/request/create-transaction.dto';

@Injectable()
export class ExpenseService {
  constructor(
    private readonly repository: ExpenseRepository,
    private readonly budgetService: BudgetService,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
    private readonly categoryService: CategoryService,
  ) {}

  private async createTransaction(
    savedExpense: ExpenseEntity,
    accountType: AccountType,
  ): Promise<TransactionDetailsDto> {
    const tx: CreateTransactionDto = {
      amount: savedExpense.amount,
      description: savedExpense.description,
      accountId: savedExpense.accountId,
      userId: savedExpense.userId,
      source: TransactionSource.EXPENSE,
      sourceId: savedExpense.uuid,
    };

    if (accountType === AccountType.CREDIT_CARD) {
      return await this.transactionService.createCreditTransaction(tx);
    }
    return await this.transactionService.createDebitTransaction(tx);
  }

  async createExpense(
    auth: AuthenticatedRequest,
    request: CreateExpenseDto,
  ): Promise<ExpenseDetailDto> {
    //validations
    const account = await this.accountService.getAccountById(request.accountId);
    if (!account) {
      throw new BadRequestException('Account does not exist');
    }

    if (request.categoryId)
      await this.categoryService.validateCategoryId(request.categoryId);

    const budgetId = request.budgetId;
    if (budgetId) await this.budgetService.validateBudgetId(budgetId);

    const expense = ExpenseMapper.toEntityFromRequest(request);
    expense.userId = auth.user.userId;

    const savedExpense = await this.repository.createEntity(expense);
    const tx = await this.createTransaction(savedExpense, account.accountType);
    savedExpense.transactionId = tx.uuid;

    void (await this.repository.updateById(savedExpense.uuid, savedExpense));

    // async call for updating the budget amountSpent
    if (budgetId) {
      void (await this.budgetService.updateAmountSpent(
        budgetId,
        Number(savedExpense.amount),
      ));
    }

    return ExpenseMapper.toDetailDtoFromEntity(savedExpense);
  }

  async updateExpense(
    uuid: string,
    request: CreateExpenseDto,
  ): Promise<ExpenseDetailDto> {
    const expense = ExpenseMapper.toEntityFromRequest(request);

    const existingExpense = await this.repository.findById(uuid);

    if (!existingExpense) {
      throw new NotFoundException(`Expense with UUID ${uuid} not found`);
    }
    const savedExpense = await this.repository.updateById(uuid, expense);

    if (!savedExpense) {
      throw new NotFoundException(`Expense with UUID ${uuid} not found`);
    }

    if (request.amount !== existingExpense.amount) {
      const delta = Number(request.amount) - Number(existingExpense.amount);

      const txReq = {
        amount: String(delta),
        description: savedExpense.description,
        accountId: savedExpense.accountId,
        userId: savedExpense.userId,
        source: TransactionSource.EXPENSE_ADJUSTMENT,
        sourceId: savedExpense.uuid,
      };
      if (delta < 0) {
        txReq.amount = txReq.amount.replace('-', '');
        await this.transactionService.createCreditTransaction(txReq);
      } else {
        await this.transactionService.createDebitTransaction(txReq);
      }
      if (savedExpense.budgetId)
        void this.budgetService.updateAmountSpent(savedExpense.budgetId, delta);
    }
    return ExpenseMapper.toDetailDtoFromEntity(savedExpense);
  }

  async findByUuid(uuid: string): Promise<ExpenseDetailDto> {
    return this.repository
      .findOne({
        where: { uuid },
        relations: ['category', 'account', 'budget'],
      })
      .then((data) => {
        if (!data) {
          throw new NotFoundException(`Expense with UUID ${uuid} not found`);
        }
        return ExpenseMapper.toDetailDtoFromEntity(data);
      });
  }

  async getExpenses(
    userId: string,
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<ExpenseDetailDto>> {
    return this.repository
      .findAll(page, size, ['category', 'account', 'budget'], { userId })
      .then((result) => ({
        ...result,
        items: result.items.map((item) =>
          ExpenseMapper.toDetailDtoFromEntity(item),
        ),
      }));
  }

  async deleteExpense(uuid: string): Promise<void> {
    const expense = await this.repository.findById(uuid);
    if (expense) {
      const txReq = {
        amount: expense.amount,
        description: 'Deleted expense',
        accountId: expense.accountId,
        userId: expense.userId,
        source: TransactionSource.EXPENSE_ADJUSTMENT,
        sourceId: expense.uuid,
      };
      void (await this.transactionService.createCreditTransaction(txReq));

      await this.repository.deleteById(uuid);
      const delta = -Number(expense.amount);
      if (expense.budgetId) {
        void (await this.budgetService.updateAmountSpent(
          expense.budgetId,
          delta,
        ));
      }
    }
  }

  async getExpensesByBudgetId(
    budgetId: string,
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<ExpenseDetailDto>> {
    return this.repository
      .findExpensesByBudgetId(budgetId, page, size, [
        'category',
        'account',
        'budget',
      ])
      .then((result) => ({
        ...result,
        items: result.items.map((item) =>
          ExpenseMapper.toDetailDtoFromEntity(item),
        ),
      }));
  }
}
