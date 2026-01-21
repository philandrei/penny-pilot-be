export class PaginatedResponseDto<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
