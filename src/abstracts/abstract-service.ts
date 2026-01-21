import { FindManyOptions } from 'typeorm';

export abstract class AbstractService {
  protected buildPagination(
    page = 1,
    size = 10,
    maxSize = 50,
  ): Pick<FindManyOptions<any>, 'skip' | 'take' | 'order'> {
    const take = Math.min(Math.max(size, 1), maxSize);
    const currentPage = Math.max(page, 1);
    const skip = (currentPage - 1) * take;

    return {
      skip,
      take,
      order: { createdAt: 'DESC' },
    };
  }
}
