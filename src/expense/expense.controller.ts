import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ExpenseService } from '@expense/service/expense.service';
import { CreateExpenseDto } from '@expense/dto/requests/create-expense.dto';
import type { AuthenticatedRequest } from '../auth/auth-request.interface';

@Controller('expenses')
@ApiBearerAuth()
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  @ApiParam({
    name: 'page',
    required: false,
  })
  @ApiParam({
    name: 'size',
    required: false,
  })
  getAllExpenses(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.expenseService.getExpenses(req.user.userId, page, size);
  }

  @Get(':budgetId/budgets')
  @ApiParam({
    name: 'page',
    required: false,
  })
  @ApiParam({
    name: 'size',
    required: false,
  })
  getAllExpensesByBudgetId(
    @Req() req: AuthenticatedRequest,
    @Param('budgetId') budgetId: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.expenseService.getExpensesByBudgetId(
      req.user.userId,
      budgetId,
      page,
      size,
    );
  }

  @Post()
  createExpense(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateExpenseDto,
  ) {
    return this.expenseService.createExpense(req.user.userId, data);
  }

  @Put(':uuid')
  updateExpense(
    @Req() req: AuthenticatedRequest,
    @Param('uuid') uuid: string,
    @Body() data: CreateExpenseDto,
  ) {
    return this.expenseService.updateExpense(req.user.userId, uuid, data);
  }

  @Get(':uuid')
  findExpense(@Req() req: AuthenticatedRequest, @Param('uuid') uuid: string) {
    return this.expenseService.findByUuid(req.user.userId, uuid);
  }

  @Delete(':uuid')
  deleteExpenseById(
    @Req() req: AuthenticatedRequest,
    @Param('uuid') uuid: string,
  ) {
    return this.expenseService.deleteExpense(req.user.userId, uuid);
  }
}
