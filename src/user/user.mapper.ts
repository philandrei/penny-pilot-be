import { CreateUserDto } from '@user/dtos/requests/create-user.dto';
import { UserDetailsDto } from '@user/dtos/response/user-details.dto';
import { UserEntity } from '@user/entity/user.entity';

export class UserMapper {
  static toEntityFromCreateDto(request: CreateUserDto): Partial<UserEntity> {
    return {
      email: request.email,
      fullName: request.fullName,
    };
  }

  static toDetailFromEntity(entity: UserEntity): UserDetailsDto {
    return {
      uuid: entity.uuid,
      fullName: entity.fullName,
      email: entity.email,
      createdAt: entity.createdAt,
      isDeleted: entity.isDeleted,
      updatedAt: entity.updatedAt,
      currency: entity.currency,
      isActive: entity.isActive,
    };
  }
}
