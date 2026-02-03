import { CreateCategoryDto } from '@category/dtos/request/create-category.dto';
import { CategoryEntity } from '@category/entity/category.entity';
import { CategoryDetailsDto } from '@category/dtos/response/create-details.dto';

export class CategoryMapper {
  static toEntityFromRequest(data: CreateCategoryDto): Partial<CategoryEntity> {
    return {
      name: data.name,
      color: data.color,
      icon: data.icon,
    };
  }

  static toDetailFromEntity(entity: CategoryEntity): CategoryDetailsDto {
    return {
      uuid: entity.uuid,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isDeleted: entity.isDeleted,
      userId: entity.userId,
      name: entity.name,
      color: entity.color,
      icon: entity.icon,
    };
  }
}
