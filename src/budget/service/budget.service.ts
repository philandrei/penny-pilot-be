import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BudgetRequestDto } from '@budget/dto/requests/budget-request.dto';
import { BudgetDetailDto } from '@budget/dto/responses/budget-detail.dto';
import { BudgetMapper } from '@budget/budget.mapper';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { BudgetEntity } from '@budget/entity/budget.entity';
import { BudgetRepository } from '@budget/repository/budget.repository';
import { isUUID } from 'class-validator';

@Injectable()
export class BudgetService {
  constructor(private readonly repository: BudgetRepository) {}

  async validateBudgetId(uuid: string): Promise<void> {
    if (!isUUID(uuid)) {
      throw new BadRequestException('Invalid budgetId');
    }

    // 2. Existence
    const budget = await this.repository.findOneBy({ uuid: uuid });
    if (!budget) {
      throw new NotFoundException('Budget not found');
    }
  }

  async updateAmountSpent(uuid: string, amount: number): Promise<void> {
    await this.validateBudgetId(uuid);
    await this.repository.incrementSpentAmount(uuid, amount);
  }

  async getEntityByUuid(uuid: string): Promise<BudgetEntity | null> {
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
}
