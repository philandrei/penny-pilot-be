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
import { CategoryService } from './service/category.service';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateCategoryDto } from '@category/dtos/request/create-category.dto';
import type { AuthenticatedRequest } from '../auth/auth-request.interface';

@Controller('categories')
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  createCategorie(
    @Req() req: AuthenticatedRequest,
    @Body() data: CreateCategoryDto,
  ) {
    return this.service.createCategory(req, data);
  }

  @Put(':uuid')
  updateCategory(@Param('uuid') uuid: string, @Body() req: CreateCategoryDto) {
    return this.service.updateCategory(uuid, req);
  }

  @Get(':uuid')
  findCategory(@Param('uuid') uuid: string) {
    return this.service.getCategoryById(uuid);
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
  findAllCategories(
    @Req() req: AuthenticatedRequest,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.service.getCategories(req.user.userId, page, size);
  }

  @Delete(':uuid')
  deleteCategorieById(@Param('uuid') uuid: string) {
    return this.service.deleteCategory(uuid);
  }
}
