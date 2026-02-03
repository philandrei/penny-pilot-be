import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { ApiParam } from '@nestjs/swagger';
import { CreateUserDto } from '@user/dtos/requests/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  createUser(@Body() req: CreateUserDto) {
    return this.service.createUser(req);
  }

  @Put(':uuid')
  updateUser(@Param('uuid') uuid: string, @Body() req: CreateUserDto) {
    return this.service.updateUser(uuid, req);
  }

  @Get(':uuid')
  findUser(@Param('uuid') uuid: string) {
    return this.service.getUserById(uuid);
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
  findAllUsers(@Query('page') page?: number, @Query('size') size?: number) {
    return this.service.getUsers(page, size);
  }

  @Delete(':uuid')
  deleteUserById(@Param('uuid') uuid: string) {
    return this.service.deleteUser(uuid);
  }
}
