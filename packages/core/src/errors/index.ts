/**
 * This library implements reusable error classes for Glue
 */

export type ErrorCode = 'NotFound' | 'Error' | 'Unauthorized' | 'Forbidden' | 'Conflict' | 'ValidationError' | 'InternalError'

export class CoreError extends Error {
  public code: ErrorCode;

  constructor(code: ErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

export class NotFoundError extends CoreError {
  constructor(message: string) {
    super('NotFound', message)
  }
}

export class UnauthorizedError extends CoreError {
  constructor(message: string) {
    super('Unauthorized', message)
  }
}

export class ForbiddenError extends CoreError {
  constructor(message: string) {
    super('Forbidden', message)
  }
}

export class GeneralError extends CoreError {
  constructor(message: string) {
    super('Error', message)
  }
}