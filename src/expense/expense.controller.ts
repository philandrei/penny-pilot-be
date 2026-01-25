import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { ExpenseService } from '@expense/service/expense.service';
import { ExpenseRequestDto } from '@expense/dto/requests/expense-request.dto';

@Controller('expenses')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get('')
  @ApiParam({
    name: 'page',
    required: false,
  })
  @ApiParam({
    name: 'size',
    required: false,
  })
  getAllExpensesById(
    @Query('budgetId') budgetId: string,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.expenseService.getExpensesByBudgetId(budgetId, page, size);
  }

  @Post(':budgetId')
  createExpense(
    @Param('budgetId') budgetId: string,
    @Body() req: ExpenseRequestDto,
  ) {
    return this.expenseService.createExpense(budgetId, req);
  }

  @Put(':uuid')
  updateExpense(@Param('uuid') uuid: string, @Body() req: ExpenseRequestDto) {
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
