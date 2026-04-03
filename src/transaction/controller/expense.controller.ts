import type { AuthenticatedRequest } from "@auth/auth-request.interface";
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";
import { ExpenseRequest } from "@transaction/dto/request/expense-request.dto";
import { TransactionSource } from "@transaction/enums/transaction.enum";
import { TransactionMutationService } from "@transaction/service/transaction-mutation.service";
import { TransactionQueryService } from "@transaction/service/transaction-query.service";
import { TransactionMapper } from "@transaction/transaction.mapper";

@Controller('expenses')
@ApiBearerAuth()
export class ExpenseController {

    constructor(private readonly txMutationService: TransactionMutationService,
        private readonly txQueryService: TransactionQueryService
    ) { }

    @Post()
    createExpense(@Req() auth: AuthenticatedRequest, @Body() request: ExpenseRequest) {
        return this.txMutationService.createExpense(auth.user.userId, request);
    }

    @Put('/:transactionId')
    updateExpense(@Req() auth: AuthenticatedRequest, @Param('transactionId') transactionId: string, @Body() request: ExpenseRequest) {
        const txUpdate = TransactionMapper.toUpdateDtoFromExpense(request);
        return this.txMutationService.updateTransaction(auth.user.userId, transactionId, txUpdate);
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
    getAllExpenses(
        @Req() auth: AuthenticatedRequest,
        @Query('page') page: number = 0,
        @Query('size') size: number = 10,
        @Query('search') search: string = "",
    ) {
        return this.txQueryService.getTransactions(auth.user.userId, TransactionSource.EXPENSE, page, size, search);
    }

    @Get('/:transactionId')
    getExpense(@Req() auth: AuthenticatedRequest, @Param('transactionId') transactionId) {
        return this.txQueryService.getTransactionById(auth.user.userId, transactionId);
    }

    @Delete('/:transactionId')
    deleteExpense(@Req() auth: AuthenticatedRequest, @Param('transactionId') transactionId: string) {
        return this.txMutationService.deleteTransaction(auth.user.userId, transactionId);
    }
}