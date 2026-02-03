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
import { BudgetService } from '@budget/service/budget.service';
import { BudgetRequestDto } from '@budget/dto/requests/budget-request.dto';
import { ApiParam } from '@nestjs/swagger';

@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  createBudget(@Body() req: BudgetRequestDto) {
    return this.budgetService.create(req);
  }

  @Put(':uuid')
  updateBudget(@Param('uuid') uuid: string, @Body() req: BudgetRequestDto) {
    return this.budgetService.update(uuid, req);
  }

  @Get(':uuid')
  findBudget(@Param('uuid') uuid: string) {
    return this.budgetService.getEntityByUuid(uuid);
  }

  @Get()
  @ApiParam({
    name: 'page',
    required: false,
  })
  @ApiParam({
    name: 'size',
    required: false,
  })
  findAllBudgets(@Query('page') page?: number, @Query('size') size?: number) {
    return this.budgetService.getBudgets(page, size);
  }

  @Delete(':uuid')
  deleteBudgetById(@Param('uuid') uuid: string) {
    return this.budgetService.deleteBudget(uuid);
  }
}
