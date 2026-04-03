import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { PaginationRequest } from "./pagination-request.dto";
import { PaginatedResponseDto } from "./paginated-response.dto";
import { AbstractEntity } from "@abstracts/abstract-entity";

@Injectable()
export class PaginationService {
  async paginate<T extends AbstractEntity>(
    repo: Repository<T>,
    request: PaginationRequest<T>
  ): Promise<PaginatedResponseDto<T>> {
    const [items, total] = await repo.findAndCount(request.query);
    return PaginatedResponseDto.fromRequest(request, items, total);
  }
}