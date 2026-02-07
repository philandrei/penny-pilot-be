import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@transaction/entity/transaction.entity';
import { TransactionRepository } from '@transaction/repository/transaction.repository';
import { TransactionController } from '@transaction/transaction.controller';
import { TransactionService } from '@transaction/service/transaction.service';
import { AccountEntity } from '@account/entity/account.entity';
import { AccountRepository } from '@account/repository/account.repository';

@Module({
  controllers: [TransactionController],
  providers: [TransactionRepository, TransactionService, AccountRepository],
  exports: [TransactionService],
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    TypeOrmModule.forFeature([AccountEntity]),
  ],
})
export class TransactionModule {}
