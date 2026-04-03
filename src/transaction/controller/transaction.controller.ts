import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import type { AuthenticatedRequest } from '@auth/auth-request.interface';
import { DepositRequest } from '../dto/request/deposit-request.dto';
import { TransactionMutationService } from '@transaction/service/transaction-mutation.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('transactions')
@ApiBearerAuth()
export class TransactionController {

    constructor(private readonly txMutationService: TransactionMutationService) { }

    @Post('/:accountId/deposit')
    deposit(@Req() auth: AuthenticatedRequest, @Param('accountId') accountId: string, @Body() request: DepositRequest) {
        return this.txMutationService.deposit(auth.user.userId, accountId, request);
    }

    @Post('/:accountId/reset-cc-balance')
    resetCreditCardBalance(@Req() auth: AuthenticatedRequest, @Param('accountId') accountId: string) {
        return this.txMutationService.resetCreditCardBalance(auth.user.userId, accountId);
    }


}
