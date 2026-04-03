import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AccountService } from './service/account.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateAccountDto } from '@account/dtos/requests/create-account.dto';
import { UpdateAccountDTO } from '@account/dtos/requests/update-account.dto';
import type { AuthenticatedRequest } from '../auth/auth-request.interface';

@Controller('accounts')
@ApiBearerAuth()
export class AccountController {
  constructor(private readonly service: AccountService) { }

  @Post()
  createAccount(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateAccountDto,
  ) {
    return this.service.createAccount(req.user.userId, data);
  }

  @Put(':uuid')
  updateAccount(@Param('uuid') uuid: string, @Body() data: UpdateAccountDTO) {
    return this.service.updateAccount(uuid, data);
  }

  @Get(':uuid')
  findAccount(@Req() req: AuthenticatedRequest, @Param('uuid') uuid: string) {
    return this.service.getAccountById(req.user.userId, uuid);
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
  findAllAccounts(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.service.getAccounts(req.user.userId, page, size);
  }

  @Delete(':uuid')
  deleteAccountById(@Param('uuid') uuid: string) {
    return this.service.deleteAccount(uuid);
  }
}
