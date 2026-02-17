import { CreateUserDto } from '@user/dto/requests/create-user.dto';
import { UserDetailsDto } from '@user/dto/response/user-details.dto';
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
      isActive: entity.isActive,
    };
  }
}
