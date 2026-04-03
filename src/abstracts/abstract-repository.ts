import {
  DataSource,
  DeepPartial,
  EntityTarget,
  FindOptionsWhere,
  Repository,
  QueryDeepPartialEntity,
  FindOptionsOrder,
  FindManyOptions,
} from 'typeorm';
import { PaginatedResponseDto } from '@common/pagination/paginated-response.dto';
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
  page?: number,
  size?: number,
  relations?: string[],
  options?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
): Promise<PaginatedResponseDto<T>> {

  const query: FindManyOptions<T> = {
    order: { createdAt: 'DESC' } as FindOptionsOrder<T>,
    relations,
    where: options,
  };

  if (page && size) {
    query.skip = (page - 1) * size;
    query.take = size;
  }

  const [items, total] = await this.findAndCount(query);

  return {
    items,
    total,
    page: page ?? 1,
    size: size ?? total,
    totalPages: size ? Math.ceil(total / size) : 1,
  };
}
}
