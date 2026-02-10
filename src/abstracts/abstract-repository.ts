import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindOptionsWhere,
  Repository,
  QueryDeepPartialEntity,
  FindOptionsOrder,
} from 'typeorm';
import { PaginatedResponseDto } from '@common/dto/paginated-response.dto';
import { AbstractEntity } from '@abstracts/abstract-entity';

export abstract class AbstractRepository<
  T extends AbstractEntity,
> extends Repository<T> {
  protected constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    super(entity, dataSource.createEntityManager());
  }

  async createEntity(data: DeepPartial<T>): Promise<T> {
    const entity = this.create(data);
    return this.save(entity);
  }

  async findById(uuid: string): Promise<T | null> {
    return this.findOneBy({ uuid } as FindOptionsWhere<T>);
  }

  async updateById(uuid: string, data: DeepPartial<T>): Promise<T | null> {
    await this.update(
      { uuid } as FindOptionsWhere<T>,
      data as QueryDeepPartialEntity<T>,
    );
    return this.findById(uuid);
  }

  async deleteById(uuid: string): Promise<void> {
    await this.delete({ uuid } as FindOptionsWhere<T>);
  }

  async findAll(
    page = 1,
    size = 10,
    relations?: string[],
    options?: FindOptionsWhere<T>,
  ): Promise<PaginatedResponseDto<T>> {
    const [items, total] = await this.findAndCount({
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' } as FindOptionsOrder<T>,
      relations,
      where: options,
    });

    return {
      items,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }
}
