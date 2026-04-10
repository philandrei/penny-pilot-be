import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionMapper } from '@transaction/transaction.mapper';
import { TransactionCategory, TransactionOrigin, TransactionStatus, TransactionType } from '@transaction/enums/transaction.enum';
import { TransactionRecord } from '@transaction/dto/response/transaction-record.dto';
import { DataSource, Repository } from 'typeorm';
import { AccountService } from '@account/service/account.service';
import { UserService } from '@user/service/user.service';
import { CategoryService } from '@category/service/category.service';
import { BudgetService } from '@budget/service/budget.service';
import { TransactionEntity } from '@transaction/entity/transaction.entity';
import { TransferMoneyRequest } from '@account/dtos/requests/transfer-amount.dto';
import { AccountDetailsDto } from '@account/dtos/response/account-detail.dto';
import { AccountType } from '@account/enum/account.enum';
import { ExpenseRequest } from '@transaction/dto/request/expense-request.dto';
import { DepositRequest } from '@transaction/dto/request/deposit-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionUpdateDto } from '@transaction/dto/request/transaction-update.dto';
import { TransactionQueryService } from './transaction-query.service';

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
    private readonly transactionQueryService: TransactionQueryService
  ) { }

  async markAsPosted(userId: string, transactionId: string): Promise<TransactionRecord> {
    await this.userService.validateUserId(userId);

    const txEntity = await this.transactionQueryService.getTransactionEntityById(userId, transactionId);
    const account = await this.accountService.getAccountById(userId, txEntity.accountId);

    return this.dataSource.transaction(async (manager) => {
      const txRepo = manager.getRepository(TransactionEntity);
      if (txEntity.source === TransactionCategory.EXPENSE) {
        const { oldBalance, newBalance } = await this.accountService.debitBalance(manager, userId, txEntity.accountId, txEntity.amount);
        txEntity.oldBalance = String(oldBalance);
        txEntity.newBalance = String(newBalance);
      } else if (txEntity.source === TransactionCategory.DEPOSIT) {
        const { oldBalance, newBalance } = await this.accountService.creditBalance(manager, userId, txEntity.accountId, txEntity.amount);
        txEntity.oldBalance = String(oldBalance);
        txEntity.newBalance = String(newBalance);
      } else if (txEntity.source === TransactionCategory.TRANSFER) {
        if (!txEntity.destinationId) {
          throw new BadRequestException("No destinationId registered");
        }

        const destinationAccount = await this.accountService.getAccountById(userId, txEntity.destinationId);
        const sourceAccountBalance: { oldBalance, newBalance } = await this.accountService.debitBalance(manager, userId, destinationAccount.uuid, txEntity.amount);
        txEntity.oldBalance = String(sourceAccountBalance.oldBalance);
        txEntity.newBalance = String(sourceAccountBalance.newBalance);

        const destinationAccountBalance: { oldBalance, newBalance } = await this.accountService.creditBalance(manager, userId, txEntity.accountId, txEntity.amount);

        const destinationTx: TransactionEntity = txRepo.create({
          userId, type: TransactionType.DEBIT, oldBalance: String(destinationAccountBalance.oldBalance),
          newBalance: String(destinationAccountBalance.newBalance), amount: txEntity.amount, source: TransactionCategory.RECEIVE,
          sourceId: txEntity.accountId, destinationId: txEntity.destinationId,
          description: `Received ${txEntity.amount} from ${account.uuid}`, accountId: destinationAccount.uuid,
          origin: TransactionOrigin.RECURRING, status: TransactionStatus.POSTED
        });

        await txRepo.save(destinationTx);

      }


      txEntity.status = TransactionStatus.POSTED;
      const savedtTx = await txRepo.save(txEntity);

      return TransactionMapper.toRecordFromEntity(savedtTx);
    })




  }

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
        source: TransactionCategory.CREDIT_RESET,
        description: 'Credit card statement paid',
      });

      const savedTx = await txRepo.save(tx);

      return TransactionMapper.toRecordFromEntity(savedTx);
    })
  }

  async createExpense(userId: string, request: ExpenseRequest, isRecurring: boolean = false): Promise<TransactionRecord> {
    await this.userService.validateUserId(userId);
    await this.accountService.validateAccountId(request.accountId);
    await this.categoryService.validateCategoryId(request.categoryId);
    if (request.budgetId) await this.budgetService.validateBudgetId(request.budgetId);

    return this.dataSource.transaction(async (manager) => {
      const txRepo = manager.getRepository(TransactionEntity);
      let tx: TransactionEntity | undefined = undefined;
      if (!isRecurring) {
        const { oldBalance, newBalance } = await this.accountService.debitBalance(manager, userId, request.accountId, request.amount);

        tx = txRepo.create({
          ...request,
          userId,
          oldBalance: String(oldBalance),
          newBalance: String(newBalance),
          source: TransactionCategory.EXPENSE,
          type: TransactionType.DEBIT,
          origin: TransactionOrigin.MANUAL,
          status: TransactionStatus.POSTED
        });
      } else {
        tx = txRepo.create({
          ...request,
          userId,
          oldBalance: "0",
          newBalance: "0",
          source: TransactionCategory.EXPENSE,
          type: TransactionType.DEBIT,
          origin: TransactionOrigin.RECURRING,
          status: TransactionStatus.PENDING
        });
      }



      const saved = await txRepo.save(tx);
      return TransactionMapper.toRecordFromEntity(saved);
    })
  }

  async transferMoney(userId: string, accountId: string, request: TransferMoneyRequest, isRecurring: boolean = false): Promise<TransactionRecord> {
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
      let savedSourceTx: TransactionEntity | undefined = undefined;

      if (!isRecurring) {
        const sourceBalance: { oldBalance, newBalance } = await this.accountService.debitBalance(manager, userId, accountId, request.amount);

        const sourceTx: TransactionEntity = txRepo.create({
          userId, type: TransactionType.DEBIT, oldBalance: sourceBalance.oldBalance,
          newBalance: sourceBalance.newBalance, amount: request.amount, source: TransactionCategory.TRANSFER,
          sourceId: accountId, destinationId: request.destinationAccountId,
          description: `Transfer ${request.amount} to ${destinationAccount.uuid}`, accountId: sourceAccount.uuid,
          origin: TransactionOrigin.MANUAL, status: TransactionStatus.POSTED
        });

        savedSourceTx = await txRepo.save(sourceTx);

        const destinationBalance: { oldBalance, newBalance } = await this.accountService.creditBalance(manager, userId, request.destinationAccountId, request.amount);

        const destinationTx: TransactionEntity = txRepo.create({
          userId, type: TransactionType.DEBIT, oldBalance: destinationBalance.oldBalance,
          newBalance: destinationBalance.newBalance, amount: request.amount, source: TransactionCategory.RECEIVE,
          sourceId: accountId, destinationId: request.destinationAccountId,
          description: `Received ${request.amount} from ${sourceAccount.uuid}`, accountId: destinationAccount.uuid,
          origin: TransactionOrigin.MANUAL, status: TransactionStatus.POSTED
        });

        await txRepo.save(destinationTx);
      } else {

        const sourceTx: TransactionEntity = txRepo.create({
          userId, type: TransactionType.DEBIT, oldBalance: '0',
          newBalance: '0', amount: request.amount, source: TransactionCategory.TRANSFER,
          sourceId: accountId, destinationId: request.destinationAccountId,
          description: `Transfer ${request.amount} to ${destinationAccount.uuid}`, accountId: sourceAccount.uuid,
          origin: TransactionOrigin.RECURRING, status: TransactionStatus.PENDING
        });

        savedSourceTx = await txRepo.save(sourceTx);
      }

      return TransactionMapper.toRecordFromEntity(savedSourceTx);
    })
  }

  async deposit(userId: string, accountId: string, request: DepositRequest, isRecurring: boolean = false): Promise<TransactionRecord> {
    await this.userService.validateUserId(userId);
    const account = await this.accountService.getAccountById(userId, accountId);
    if (account.type === AccountType.CREDIT_CARD) {
      throw new BadRequestException(
        'Credit card should not deposit.',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const txRepo = manager.getRepository(TransactionEntity);
      let txEntity: TransactionEntity | undefined = undefined;
      if (!isRecurring) {
        const { oldBalance, newBalance } = await this.accountService.creditBalance(manager, userId, accountId, request.amount);

        txEntity = txRepo.create({
          ...request,
          userId: userId,
          oldBalance: String(oldBalance),
          newBalance: String(newBalance),
          source: TransactionCategory.DEPOSIT,
          type: TransactionType.CREDIT,
          date: new Date(),
          origin: TransactionOrigin.MANUAL,
          status: TransactionStatus.POSTED
        });
      } else {
        txEntity = txRepo.create({
          ...request,
          userId: userId,
          oldBalance: '0',
          newBalance: '0',
          source: TransactionCategory.DEPOSIT,
          type: TransactionType.CREDIT,
          date: new Date(),
          origin: TransactionOrigin.RECURRING,
          status: TransactionStatus.PENDING
        });
      }

      const savedTx = await txRepo.save(txEntity);

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
