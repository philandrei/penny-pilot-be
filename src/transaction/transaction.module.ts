import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '@transaction/entity/transaction.entity';
import { AccountModule } from '@account/account.module';
import { TransactionRepository } from '@transaction/repository/transaction.repository';
import { TransactionController } from '@transaction/transaction.controller';
import { TransactionService } from '@transaction/service/transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionRepository, TransactionService],
  exports: [TransactionService],
  imports: [TypeOrmModule.forFeature([TransactionEntity]), AccountModule],
})
export class TransactionModule {}
