import { AccountService } from "@account/service/account.service";
import { BudgetService } from "@budget/service/budget.service";
import { PaginatedResponseDto } from "@common/pagination/paginated-response.dto";
import { PaginationRequest } from "@common/pagination/pagination-request.dto";
import { PaginationService } from "@common/pagination/pagination.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionRecord } from "@transaction/dto/response/transaction-record.dto";
import { TransactionEntity } from "@transaction/entity/transaction.entity";
import { TransactionCategory } from "@transaction/enums/transaction.enum";
import { TransactionMapper } from "@transaction/transaction.mapper";
import { UserService } from "@user/service/user.service";
import { FindOptionsWhere, ILike, Repository } from "typeorm";

@Injectable()
export class TransactionQueryService {
    constructor(@InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
        private readonly paginationService: PaginationService,
        private readonly budgetService: BudgetService,
        private readonly userService: UserService,
        private readonly accountService: AccountService,
    ) { }

    async getTransactionEntityById(userId: string, transactionId: string): Promise<TransactionEntity> {
        const entity = await this.repository.findOneBy({ uuid: transactionId });
        if (!entity) {
            throw new NotFoundException('Transaction ID does not exist');
        }
        return entity;
    }

    async getTransactionById(userId: string, transactionId: string): Promise<TransactionRecord> {
        await this.userService.validateUserId(userId);

        const entity = await this.repository.findOneBy({
            userId,
            id: transactionId,
        } as FindOptionsWhere<TransactionEntity>);

        if (!entity) {
            throw new NotFoundException('Transaction ID does not exist');
        }

        return TransactionMapper.toRecordFromEntity(entity);
    }

    async getTransactions(
        userId: string,
        source: TransactionCategory,
        page?: number,
        size?: number,
        search?: string
    ): Promise<PaginatedResponseDto<TransactionRecord>> {
        await this.userService.validateUserId(userId);


        const options = [{ userId, source, description: ILike(`%${search}%`) },
        { userId, source, category: { name: ILike(`%${search}%`) } },
        { userId, source, account: { name: ILike(`%${search}%`) } }];
        const request = PaginationRequest.create<TransactionEntity>(page, size, ['category', 'account'], options, { date: 'DESC' });
        return await this.paginationService.paginate(this.repository, request)
            .then((page) => ({
                ...page,
                items: page.items.map((item) => TransactionMapper.toRecordFromEntity(item)),
                totalExpense: page.items.reduce((sum, item) => sum + (Number(item.amount) ?? 0), 0)
            }));
    }

    async getTransactionsByAccountId(
        userId: string,
        accountId: string,
        page?: number,
        size?: number,
        search?: string,
    ): Promise<PaginatedResponseDto<TransactionRecord>> {
        await this.userService.validateUserId(userId);
        await this.accountService.validateAccountId(accountId);

        const options = [{ userId, accountId, description: ILike(`%${search}%`) },
        { userId, accountId, category: { name: ILike(`%${search}%`) } },
        { userId, accountId, account: { name: ILike(`%${search}%`) } }];
        const request = PaginationRequest.create<TransactionEntity>(page, size, ['category', 'account'], options);
        return await this.paginationService.paginate(this.repository, request)
            .then((page) => ({ ...page, items: page.items.map((item) => TransactionMapper.toRecordFromEntity(item)) }));
    }

    async getTransactionsByBudgetId(userId: string, budgetId: string, page: number, size: number): Promise<PaginatedResponseDto<TransactionRecord>> {
        await this.userService.validateUserId(userId);
        await this.budgetService.validateBudgetId(budgetId);

        const pageRequest = PaginationRequest.create<TransactionEntity>(page, size, [], { userId, budgetId })

        return await this.paginationService.paginate(this.repository, pageRequest)
            .then((data) => ({ ...data, items: data.items.map((item) => TransactionMapper.toRecordFromEntity(item)) }));
    }
}