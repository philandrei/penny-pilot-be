import { AbstractEntity } from '@abstracts/abstract-entity';
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere } from 'typeorm';

export class PaginationRequest<T extends AbstractEntity> {
    page: number;
    size: number;
    query: FindManyOptions<T>;

    private constructor(
        page: number,
        size: number,
        query: FindManyOptions<T>
    ) {
        this.page = page;
        this.size = size;
        this.query = query;
    }

    static create<T extends AbstractEntity>(
        page = 1,
        size = 10,
        relations?: string[],
        where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
        order?: FindOptionsOrder<T>
    ): PaginationRequest<T> {

        const query: FindManyOptions<T> = {
            order: order ?? { createdAt: 'DESC' } as FindOptionsOrder<T>,
            relations,
            where,
            skip: (page - 1) * size,
            take: size,
        };

        return new PaginationRequest(page, size, query);
    }
}