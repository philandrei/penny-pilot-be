import { PaginationRequest } from "./pagination-request.dto";

export class PaginatedResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;

  private constructor(
    items: T[],
    total: number,
    page: number,
    size: number
  ) {
    this.items = items;
    this.total = total;
    this.page = page;
    this.size = size;
    this.totalPages = size > 0 ? Math.ceil(total / size) : 0;
  }

  static fromRequest<T>(
    request: PaginationRequest<any>,
    items: T[],
    total: number
  ): PaginatedResponseDto<T> {
    return new PaginatedResponseDto(
      items,
      total,
      request.page,
      request.size
    );
  }
}