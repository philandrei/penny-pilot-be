export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TransactionCategory {
  EXPENSE = 'EXPENSE',
  EXPENSE_ADJUSTMENT = 'EXPENSE_ADJUSTMENT',
  INCOME = 'INCOME',
  INCOME_ADJUSTMENT = 'INCOME_ADJUSTMENT',
  TRANSFER = 'TRANSFER',
  CREDIT_RESET = 'CREDIT_RESET',
  DEPOSIT = 'DEPOSIT',
  RECEIVE = 'RECEIVE',
}

export enum TransactionOrigin {
  MANUAL = 'MANUAL',
  RECURRING = 'RECURRING'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  POSTED = 'POSTED'
}
