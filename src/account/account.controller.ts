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
import { ApiParam } from '@nestjs/swagger';
import { CreateAccountDto } from '@account/dtos/requests/create-account.dto';
import { UpdateAccountDTO } from '@account/dtos/requests/update-account.dto';
import type { AuthenticatedRequest } from '../auth/auth-request.interface';

@Controller('accounts')
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Post()
  createAccount(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateAccountDto,
  ) {
    return this.service.createAccount(req, data);
  }

  @Put(':uuid')
  updateAccount(@Param('uuid') uuid: string, @Body() data: UpdateAccountDTO) {
    return this.service.updateAccount(uuid, data);
  }

  @Get(':uuid')
  findAccount(@Param('uuid') uuid: string) {
    return this.service.getAccountById(uuid);
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
  findAllAccounts(@Query('page') page?: number, @Query('size') size?: number) {
    return this.service.getAccounts(page, size);
  }

  @Delete(':uuid')
  deleteAccountById(@Param('uuid') uuid: string) {
    return this.service.deleteAccount(uuid);
  }
}
