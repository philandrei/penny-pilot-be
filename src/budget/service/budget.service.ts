import { Injectable, NotFoundException } from '@nestjs/common';
import { BudgetRequestDto } from '@budget/dto/requests/budget-request.dto';
import { BudgetDetailDto } from '@budget/dto/responses/budget-detail.dto';
import { BudgetMapper } from '@budget/budget.mapper';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { PrismaService } from '@prisma/prisma.service';

@Injectable()
export class BudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async updateAmountSpent(id: string): Promise<void> {
    const total = await this.sumExpensesByBudgetId(id);
    const budget = await this.prisma.budget.findUnique({ where: { id } });
    if (budget) {
      budget.amountSpent = total != null ? total : '0';
      await this.repository.save(budget);
    }
  }

  async findEntityByUuid(uuid: string): Promise<BudgetEntity | null> {
    return await this.repository.findOneBy({ uuid });
  }

  async create(req: BudgetRequestDto): Promise<BudgetDetailDto> {
    const budget = BudgetMapper.toEntityFromRequest(req);
    const savedBudget = await this.repository.createEntity(budget);
    return BudgetMapper.toDetailFromEntity(savedBudget);
  }

  async update(uuid: string, req: BudgetRequestDto): Promise<BudgetDetailDto> {
    const budget = BudgetMapper.toEntityFromRequest(req);

    return await this.repository.updateById(uuid, budget).then((data) => {
      if (!data) {
        throw new NotFoundException(`Budget with UUID ${uuid} not found`);
      }
      return BudgetMapper.toDetailFromEntity(data);
    });
  }

  async findByUuid(uuid: string): Promise<BudgetDetailDto> {
    return await this.repository.findById(uuid).then((data) => {
      if (!data) {
        throw new NotFoundException(`Budget with UUID ${uuid} not found`);
      }
      return BudgetMapper.toDetailFromEntity(data);
    });
  }

  async getBudgets(
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<BudgetDetailDto>> {
    return this.repository.findAll(page, size).then((result) => ({
      ...result,
      items: result.items.map((item) => BudgetMapper.toDetailFromEntity(item)),
    }));
  }

  async deleteBudget(uuid: string): Promise<void> {
    await this.repository.deleteById(uuid);
  }

  private async sumExpensesByBudgetId(id: string) {
    const result = await this.prisma.expense.aggregate({
      where: { id },
      _sum: {
        amount: true,
      },
    });
    return result._sum.amount;
  }
}
