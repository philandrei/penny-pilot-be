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
import { BudgetService } from '@budget/service/budget.service';
import { BudgetRequestDto } from '@budget/dto/requests/budget-request.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import type { AuthenticatedRequest } from '../auth/auth-request.interface';

@Controller('budgets')
@ApiBearerAuth()
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  createBudget(
    @Req() req: AuthenticatedRequest,
    @Body() data: BudgetRequestDto,
  ) {
    return this.budgetService.create(req.user.userId, data);
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
  findAllBudgets(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.budgetService.getBudgets(req.user.userId, page, size);
  }

  @Delete(':uuid')
  deleteBudgetById(@Param('uuid') uuid: string) {
    return this.budgetService.deleteBudget(uuid);
  }
}
