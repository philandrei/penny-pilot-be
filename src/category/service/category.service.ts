import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../auth/auth-request.interface';
import { CreateCategoryDto } from '@category/dtos/request/create-category.dto';
import { CategoryDetailsDto } from '@category/dtos/response/create-details.dto';
import { CategoryMapper } from '@category/category.mapper';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { CategoryEntity } from '@category/entity/category.entity';
import { isUUID } from 'class-validator';
import { CategoryRepository } from '@category/repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async validateCategoryId(uuid: string): Promise<void> {
    if (!isUUID(uuid)) {
      throw new BadRequestException('Invalid categoryId');
    }

    // 2. Existence
    const category = await this.repository.findOneBy({ uuid: uuid });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }

  async findEntityByUuid(uuid: string): Promise<CategoryEntity | null> {
    return await this.repository.findOneBy({ uuid });
  }

  async createCategory(
    auth: AuthenticatedRequest,
    request: CreateCategoryDto,
  ): Promise<CategoryDetailsDto> {
    const category = CategoryMapper.toEntityFromRequest(request);
    category.userId = auth.user.userId;
    return await this.repository
      .createEntity(category)
      .then((data) => CategoryMapper.toDetailFromEntity(data));
  }

  async updateCategory(
    uuid: string,
    request: CreateCategoryDto,
  ): Promise<CategoryDetailsDto> {
    const category = CategoryMapper.toEntityFromRequest(request);
    return await this.repository.updateById(uuid, category).then((data) => {
      if (!data) {
        throw new NotFoundException(`Category with UUID ${uuid} not found`);
      }
      return CategoryMapper.toDetailFromEntity(data);
    });
  }

  async getCategoryById(uuid: string): Promise<CategoryDetailsDto> {
    return await this.repository.findById(uuid).then((data) => {
      if (!data) {
        throw new NotFoundException(`Category with UUID ${uuid} not found`);
      }
      return CategoryMapper.toDetailFromEntity(data);
    });
  }

  async getCategories(
    userId: string,
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<CategoryDetailsDto>> {
    return this.repository
      .findAll(page, size, undefined, { userId })
      .then((result) => ({
        ...result,
        items: result.items.map((item) =>
          CategoryMapper.toDetailFromEntity(item),
        ),
      }));
  }

  async deleteCategory(uuid: string): Promise<void> {
    await this.repository.deleteById(uuid);
  }
}
