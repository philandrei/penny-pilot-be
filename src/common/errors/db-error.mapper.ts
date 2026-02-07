import { HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export interface MappedError {
  status: number;
  message: string;
}

type PgDriverError = {
  code?: string;
  detail?: string;
  constraint?: string;
};

export function mapDatabaseError(exception: unknown): MappedError | null {
  if (!(exception instanceof QueryFailedError)) {
    return null;
  }

  const driver = exception.driverError as PgDriverError;

  switch (driver.code) {
    // Unique violation
    case '23505':
      return {
        status: HttpStatus.CONFLICT,
        message: 'Resource already exists',
      };

    // Foreign key violation
    case '23503':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Referenced resource does not exist',
      };

    // NOT NULL violation
    case '23502':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Missing required database field',
      };

    // Invalid text/UUID representation
    case '22P02':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid input format',
      };

    // Numeric out of range
    case '22003':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Numeric value out of range',
      };

    default:
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Database operation failed',
      };
  }
}
