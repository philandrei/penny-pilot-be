import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionMapper } from '@transaction/transaction.mapper';
import { TransactionSource, TransactionType } from '@transaction/enums/transaction.enum';
import { TransactionRecord } from '@transaction/dto/response/transaction-record.dto';
import { DataSource, Repository } from 'typeorm';
import { AccountService } from '@account/service/account.service';
import { UserService } from '@user/service/user.service';
import { CategoryService } from '@category/service/category.service';
import { BudgetService } from '@budget/service/budget.service';
import { TransactionEntity } from '@transaction/entity/transaction.entity';
import { TransferAmountDto } from '@account/dtos/requests/transfer-amount.dto';
import { AccountDetailsDto } from '@account/dtos/response/account-detail.dto';
import { AccountType } from '@account/enum/account.enum';
import { ExpenseRequest } from '@transaction/dto/request/expense-request.dto';
import { DepositRequest } from '@transaction/dto/request/deposit-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionUpdateDto } from '@transaction/dto/request/transaction-update.dto';

@Injectable()
export class TransactionMutationService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repository: Repository<TransactionEntity>,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly budgetService: BudgetService,
    private readonly dataSource: DataSource,
  ) { }

  async resetCreditCardBalance(userId: string, accountId: string): Promise<TransactionRecord> {
    await this.userService.validateUserId(userId);
    const account = await this.accountService.getAccountById(userId, accountId);

    if (account.type !== AccountType.CREDIT_CARD) {
      throw new BadRequestException('Account is not a credit card');
    }

    return this.dataSource.transaction(async (manager) => {
      const txRepo = manager.getRepository(TransactionEntity);
      const { oldBalance, newBalance } = await this.accountService.debitBalance(manager, userId, accountId, account.balance);

      const tx = txRepo.create({
        userId,
        accountId,
        type: TransactionType.DEBIT,
        date: new Date(),
        oldBalance: String(oldBalance),
        newBalance: String(newBalance),
        amount: account.balance,
        source: TransactionSource.CREDIT_RESET,
        description: 'Credit card statement paid',
      });

      const savedTx = await txRepo.save(tx);

      return TransactionMapper.toRecordFromEntity(savedTx);
    })
  }

  async createExpense(userId: string, request: ExpenseRequest): Promise<TransactionRecord> {
    await this.userService.validateUserId(userId);
    await this.accountService.validateAccountId(request.accountId);
    await this.categoryService.validateCategoryId(request.categoryId);
    if (request.budgetId) await this.budgetService.validateBudgetId(request.budgetId);

    return this.dataSource.transaction(async (manager) => {
      const txRepo = manager.getRepository(TransactionEntity);

      const { oldBalance, newBalance } = await this.accountService.debitBalance(manager, userId, request.accountId, request.amount);

      const tx = txRepo.create({
        ...request,
        userId,
        oldBalance: String(oldBalance),
        newBalance: String(newBalance),
        source: TransactionSource.EXPENSE,
        type: TransactionType.DEBIT
      });

      const saved = await txRepo.save(tx);
      return TransactionMapper.toRecordFromEntity(saved);
    })
  }

  async transferAmount(userId: string, accountId: string, request: TransferAmountDto): Promise<TransactionRecord> {
    const sourceAccount: AccountDetailsDto = await this.accountService.getAccountById(userId, accountId).then((data) => {
      if (data.type === AccountType.CREDIT_CARD) {
        throw new BadRequestException(
          'Credit card should not transfer amount.',
        );
      }
      return data;
    });

    const destinationAccount: AccountDetailsDto = await this.accountService.getAccountById(userId, request.destinationAccountId).then((data) => {
      if (data.type === AccountType.CREDIT_CARD) {
        throw new BadRequestException(
          'Destination account should not be a Credit card',
        );
      }
      return data;
    }).catch((error) => {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new NotFoundException("Destination account doesn't exist");
    })

    return this.dataSource.transaction(async (manager) => {
      const txRepo = manager.getRepository(TransactionEntity);
      const sourceBalance: { oldBalance, newBalance } = await this.accountService.debitBalance(manager, userId, accountId, request.amount);

      const sourceTx: TransactionEntity = txRepo.create({
        userId, type: TransactionType.DEBIT, oldBalance: sourceBalance.oldBalance,
        newBalance: sourceBalance.newBalance, amount: request.amount, source: TransactionSource.TRANSFER,
        sourceId: accountId, destinationId: request.destinationAccountId,
        description: `Transfer ${request.amount} to ${destinationAccount.uuid}`, accountId: sourceAccount.uuid
      });

      const saved = await txRepo.save(sourceTx);

      const destinationBalance: { oldBalance, newBalance } = await this.accountService.creditBalance(manager, userId, request.destinationAccountId, request.amount);

      const destinationTx: TransactionEntity = txRepo.create({
        userId, type: TransactionType.DEBIT, oldBalance: destinationBalance.oldBalance,
        newBalance: destinationBalance.newBalance, amount: request.amount, source: TransactionSource.RECEIVE,
        sourceId: accountId, destinationId: request.destinationAccountId,
        description: `Received ${request.amount} from ${sourceAccount.uuid}`, accountId: destinationAccount.uuid
      });

      await txRepo.save(destinationTx);

      return TransactionMapper.toRecordFromEntity(saved);
    })
  }

  async deposit(userId: string, accountId: string, request: DepositRequest): Promise<TransactionRecord> {
    await this.userService.validateUserId(userId);
    const account = await this.accountService.getAccountById(userId, accountId);
    if (account.type === AccountType.CREDIT_CARD) {
      throw new BadRequestException(
        'Credit card should not deposit.',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const txRepo = manager.getRepository(TransactionEntity);

      const { oldBalance, newBalance } = await this.accountService.creditBalance(manager, userId, accountId, request.amount);

      const tx = txRepo.create({
        ...request,
        userId: userId,
        oldBalance: String(oldBalance),
        newBalance: String(newBalance),
        source: TransactionSource.DEPOSIT,
        type: TransactionType.CREDIT,
        date: new Date()
      });

      const savedTx = await txRepo.save(tx);

      return TransactionMapper.toRecordFromEntity(savedTx);
    })
  }

  async updateTransaction(userId: string, transactionId: string, request: TransactionUpdateDto): Promise<TransactionRecord> {
    await this.userService.validateUserId(userId);

    const entity = await this.repository.findOneBy({ userId, uuid: transactionId });
    if (!entity) {
      throw new NotFoundException('Transaction ID does not exist');
    }

    Object.assign(entity, request)

    const savedTx = await this.repository.save(entity);

    return TransactionMapper.toRecordFromEntity(savedTx);
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    await this.userService.validateUserId(userId);

    await this.repository.delete({ uuid: transactionId });
  }

}
