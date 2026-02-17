import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repository/user.repository';
import { CreateUserDto } from '@user/dto/requests/create-user.dto';
import { UserDetailsDto } from '@user/dto/response/user-details.dto';
import { UserMapper } from '@user/user.mapper';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { UserEntity } from '@user/entity/user.entity';
import { hash } from '@common/utils/hash';
import { UserType } from '@user/enum/user.enum';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    const user: UserEntity | null = await this.getUserEntityById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    user.refreshToken = refreshToken ? await hash(refreshToken) : refreshToken;
    await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository.findByEmail(email);
  }

  async createUser(request: CreateUserDto): Promise<UserDetailsDto> {
    const entity = UserMapper.toEntityFromCreateDto(request);

    if (request.userType === UserType.LOCAL && request.password != null) {
      entity.password = await hash(request.password);
    }

    return this.repository
      .createEntity(entity)
      .then((data) => UserMapper.toDetailFromEntity(data));
  }

  async getUserEntityById(uuid: string): Promise<UserEntity | null> {
    return await this.repository.findById(uuid);
  }

  async updateUser(
    uuid: string,
    request: CreateUserDto,
  ): Promise<UserDetailsDto> {
    const entity = UserMapper.toEntityFromCreateDto(request);
    return await this.repository.updateById(uuid, entity).then((data) => {
      if (!data) {
        throw new NotFoundException(`User with UUID ${uuid} not found`);
      }
      return UserMapper.toDetailFromEntity(data);
    });
  }

  async getUserById(uuid: string): Promise<UserDetailsDto> {
    return await this.repository.findById(uuid).then((data) => {
      if (!data) {
        throw new NotFoundException(`User with UUID ${uuid} not found`);
      }
      return UserMapper.toDetailFromEntity(data);
    });
  }

  async getUsers(
    page?: number,
    size?: number,
  ): Promise<PaginatedResponseDto<UserDetailsDto>> {
    return this.repository.findAll(page, size).then((result) => ({
      ...result,
      items: result.items.map((item) => UserMapper.toDetailFromEntity(item)),
    }));
  }

  async deleteUser(uuid: string): Promise<void> {
    await this.repository.deleteById(uuid);
  }
}
