import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { RecurringService } from "./service/recurring.service";
import { RecurringRequest } from "./dto/request/recurring-request.dto";
import type { AuthenticatedRequest } from "@auth/auth-request.interface";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";

@Controller('recurrings')
@ApiBearerAuth()
export class RecurringController {

    constructor(private readonly service: RecurringService) { }

    @Post()
    createRecurringRecord(@Req() auth: AuthenticatedRequest, @Body() request: RecurringRequest) {
        return this.service.create(auth.user.userId, request);
    }

    @Put('/:recurringId')
    updateRecurringRecord(@Req() auth: AuthenticatedRequest, @Param('recurringId') recurringId: string, @Body() request: RecurringRequest) {
        return this.service.update(auth.user.userId, recurringId, request);
    }

    @Get('/:recurringId')
    getOneRecurringRecord(@Req() auth: AuthenticatedRequest, @Param('recurringId') recurringId: string) {
        return this.service.getRecurringRecordById(auth.user.userId, recurringId);
    }

    @Get()
    @ApiParam({
        name: 'page',
        required: false,
    })
    @ApiParam({
        name: 'size',
        required: false,
    })
    @ApiParam({
        name: 'search',
        required: false
    })
    getRecurringRecords(@Req() auth: AuthenticatedRequest, @Query('page') page: number = 1,
        @Query('size') size: number = 10,
        @Query('search') search: string = "",) {
        return this.service.getRecurringRecords(auth.user.userId, page, size, search);
    }

    @Delete('/:recurringId')
    deleteRecurringRecord(@Req() auth: AuthenticatedRequest, @Param('recurringId') recurringId: string) {
        return this.service.deleteRecurring(auth.user.userId, recurringId);
    }

}