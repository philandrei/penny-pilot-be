import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { RecurringEntity } from "../entity/recurring.entity";
import { RecurringRequest } from "../dto/request/recurring-request.dto";
import { RecurringRecord } from "../dto/response/recurring-record.dto";
import { UserService } from "@user/service/user.service";
import { RecurringFrequency } from "../enum/recurring.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { RecurringMapper } from "../recurring.mapper";
import { isUUID } from "class-validator";
import { PaginatedResponseDto } from "@common/pagination/paginated-response.dto";
import { PaginationRequest } from "@common/pagination/pagination-request.dto";
import { PaginationService } from "@common/pagination/pagination.service";

@Injectable()
export class RecurringService {
    constructor(
        @InjectRepository(RecurringEntity)
        private readonly repo: Repository<RecurringEntity>,
        private readonly userService: UserService,
        private readonly paginatedService: PaginationService,
    ) { }

    async create(userId: string, request: RecurringRequest): Promise<RecurringRecord> {
        this.userService.validateUserId(userId);

        const dayOfWeekMap: number | undefined = request.dayOfWeek ? this.mapDayOfWeek(request.dayOfWeek) : undefined;
        const nextRunDate = this.computeNextRunDate(request.frequency, dayOfWeekMap, request.dayOfMonth)

        const recurringEntity: RecurringEntity = this.repo.create({
            userId,
            name: request.name,
            amount: request.amount,
            transactionCategory: request.transactionCategory,
            frequency: request.frequency,
            dayOfMonth: request.dayOfMonth,
            dayOfWeek: dayOfWeekMap,
            nextRunDate,
            active: true,
            accountId: request.accountId,
            categoryId: request.categoryId,
            destinationAccountId: request.destinationAccountId
        });

        const savedEntity: RecurringEntity = await this.repo.save(recurringEntity);
        return RecurringMapper.toRecordFromEntity(savedEntity);
    }

    async update(userId: string, recurringId: string, request: RecurringRequest): Promise<RecurringRecord> {
        this.userService.validateUserId(userId);
        this.validateRecurringId(recurringId);

        const existingRecurringRecord: RecurringEntity = await this.repo.findOneByOrFail({ uuid: recurringId });
        const dayOfWeekMap: number | undefined = request.dayOfWeek ? this.mapDayOfWeek(request.dayOfWeek) : undefined;
        existingRecurringRecord.name = request.name;
        existingRecurringRecord.amount = request.amount;
        existingRecurringRecord.transactionCategory = request.transactionCategory;
        existingRecurringRecord.frequency = request.frequency;
        existingRecurringRecord.dayOfMonth = request.dayOfMonth;
        existingRecurringRecord.dayOfWeek = dayOfWeekMap;
        existingRecurringRecord.accountId = request.accountId;
        existingRecurringRecord.destinationAccountId = request.destinationAccountId;
        existingRecurringRecord.categoryId = request.categoryId;

        if (existingRecurringRecord.frequency != request.frequency
            && existingRecurringRecord.dayOfMonth != request.dayOfMonth
        ) {
            existingRecurringRecord.nextRunDate = this.computeNextRunDate(request.frequency, undefined, request.dayOfMonth);
        }
        else if (existingRecurringRecord.frequency != request.frequency
            && existingRecurringRecord.dayOfWeek != request.dayOfWeek) {
            existingRecurringRecord.nextRunDate = this.computeNextRunDate(request.frequency, dayOfWeekMap, undefined);
        }

        const savedRecurring = await this.repo.save(existingRecurringRecord);

        return RecurringMapper.toRecordFromEntity(savedRecurring);
    }

    async getRecurringRecordById(userId: string, uuid: string): Promise<RecurringRecord | null> {
        this.userService.validateUserId(userId);
        return await this.repo.findOneBy({ uuid });
    }

    async getRecurringRecords(userId: string, page?: number,
        size?: number,
        search?: string): Promise<PaginatedResponseDto<RecurringRecord>> {
        this.userService.validateUserId(userId);

        const options = [{ userId, name: ILike(`%${search}%`) }];
        const request = PaginationRequest.create<RecurringEntity>(page, size, [], options);
        return await this.paginatedService.paginate(this.repo, request)
            .then((page) => ({ ...page, items: page.items.map((item) => RecurringMapper.toRecordFromEntity(item)) }));
    }

    async deleteRecurring(userId: string, uuid: string): Promise<void> {
        await this.repo.delete({ uuid });
    }


    async validateRecurringId(uuid: string): Promise<void> {
        if (!isUUID(uuid)) {
            throw new BadRequestException('Invalid accountId');
        }

        const exist = this.repo.findOneBy({ uuid });

        if (!exist) {
            throw new NotFoundException('Recurring record not found');
        }
    }

    private mapDayOfWeek(dayOfWeek: string): number {
        switch (dayOfWeek.toUpperCase()) {
            case 'MONDAY':
                return 1;
            case 'TUESDAY':
                return 2;
            case 'WEDNESDAY':
                return 3;
            case 'THURSDAY':
                return 4;
            case 'FRIDAY':
                return 5;
            case 'SATURDAY':
                return 6;
            case 'SUNDAY':
                return 7;
            default:
                throw new BadRequestException('Invalid day of week');
        }
    }

    public computeNextRunDate(frequency: RecurringFrequency, dayOfWeek?: number, dayOfMonth?: number, nextRunDate?: Date): Date {

        const now = nextRunDate ?? new Date();
        switch (frequency) {
            case RecurringFrequency.DAILY:
                return this.getNextDaily(now);
            case RecurringFrequency.WEEKLY:
                if (dayOfWeek == null) throw new BadRequestException('Day of week is missing');

                return this.getNextWeekly(now, dayOfWeek);
            case RecurringFrequency.MONTHLY:
                if (dayOfMonth == null) throw new BadRequestException('Day of month is missing');
                return this.getNextMonthly(now, dayOfMonth);
            default:
                throw new BadRequestException('Invalid Frequency');
        }
    }

    private getNextDaily(date: Date): Date {
        const next = new Date(date);
        next.setDate(next.getDate() + 1);
        return next;
    }

    private getNextWeekly(date: Date, targetDay: number): Date {
        const next = new Date(date);
        const currentDay = next.getDay();

        let diff = targetDay - currentDay;

        if (diff <= 0) {
            diff += 7; // move to next week
        }

        next.setDate(next.getDate() + diff);
        return next;
    }

    private getNextMonthly(date: Date, dayOfMonth: number): Date {
        const year = date.getFullYear();
        const month = date.getMonth();

        // Try current month first
        let next = new Date(year, month, dayOfMonth);

        if (next <= date) {
            // move to next month
            next = new Date(year, month + 1, dayOfMonth);
        }

        // Handle invalid dates (e.g., Feb 30)
        if (next.getDate() !== dayOfMonth) {
            // fallback to last day of month
            next = new Date(next.getFullYear(), next.getMonth() + 1, 0);
        }

        return next;
    }
}