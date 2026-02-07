import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './entity/account.entity';
import { AccountService } from './service/account.service';
import { AccountRepository } from './repository/account.repository';
import { AccountController } from './account.controller';
import { TransactionModule } from '@transaction/transaction.module';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity]), TransactionModule],
  providers: [AccountService, AccountRepository],
  controllers: [AccountController],
  exports: [AccountService, AccountRepository],
})
export class AccountModule {}
