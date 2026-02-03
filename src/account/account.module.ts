import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entity/account.entity';
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/account.repository';
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountService, AccountRepository],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
