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
import { ApiParam } from '@nestjs/swagger';
import { ExpenseService } from '@expense/service/expense.service';
import { CreateExpenseDto } from '@expense/dto/requests/create-expense.dto';
import type { AuthenticatedRequest } from '../auth/auth-request.interface';

@Controller('expenses')
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
  getAllExpenses(@Query('page') page?: number, @Query('size') size?: number) {
    return this.expenseService.getExpenses(page, size);
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
    @Param('budgetId') budgetId: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.expenseService.getExpensesByBudgetId(budgetId, page, size);
  }

  @Post()
  createExpense(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateExpenseDto,
  ) {
    return this.expenseService.createExpense(req, data);
  }

  @Put(':uuid')
  updateExpense(@Param('uuid') uuid: string, @Body() req: CreateExpenseDto) {
    return this.expenseService.updateExpense(uuid, req);
  }

  @Get(':uuid')
  findExpense(@Param('uuid') uuid: string) {
    return this.expenseService.findByUuid(uuid);
  }

  // @Get()
  // @ApiParam({
  //   name: 'page',
  //   required: false,
  // })
  // @ApiParam({
  //   name: 'size',
  //   required: false,
  // })
  // findAllExpenses(@Query('page') page?: number, @Query('size') size?: number) {
  //   return this.expenseService.getExpenses(page, size);
  // }

  @Delete(':uuid')
  deleteExpenseById(@Param('uuid') uuid: string) {
    return this.expenseService.deleteExpense(uuid);
  }
}
