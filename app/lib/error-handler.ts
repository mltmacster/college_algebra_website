
import { NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';

export enum ErrorCodes {
  // Database errors
  DATABASE_CONNECTION_FAILED = 'DB_CONNECTION_FAILED',
  DATABASE_QUERY_FAILED = 'DB_QUERY_FAILED',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',

  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',

  // Application errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}

export class AppError extends Error {
  public readonly code: ErrorCodes;
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCodes,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Predefined error creators
export const createDatabaseError = (message: string, originalError?: any) =>
  new AppError(
    message,
    ErrorCodes.DATABASE_QUERY_FAILED,
    500
  );

export const createValidationError = (message: string) =>
  new AppError(
    message,
    ErrorCodes.INVALID_INPUT,
    400
  );

export const createAuthError = (message: string) =>
  new AppError(
    message,
    ErrorCodes.UNAUTHORIZED,
    401
  );

export const createNotFoundError = (resource: string) =>
  new AppError(
    `${resource} not found`,
    ErrorCodes.RECORD_NOT_FOUND,
    404
  );

// Error handler middleware
export function handleApiError(error: any): NextResponse {
  // Log error details
  console.error('API Error:', {
    message: error.message,
    stack: error.stack,
    code: error.code || 'UNKNOWN',
    timestamp: new Date().toISOString(),
  });

  // Handle known error types
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  // Handle Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.DUPLICATE_RECORD,
              message: 'A record with this information already exists',
            },
          },
          { status: 409 }
        );
      case 'P2025':
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.RECORD_NOT_FOUND,
              message: 'The requested record was not found',
            },
          },
          { status: 404 }
        );
      default:
        return NextResponse.json(
          {
            success: false,
            error: {
              code: ErrorCodes.DATABASE_QUERY_FAILED,
              message: 'Database operation failed',
            },
          },
          { status: 500 }
        );
    }
  }

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.INVALID_INPUT,
          message: 'Validation failed',
          details: error.errors,
        },
      },
      { status: 400 }
    );
  }

  // Handle connection timeout errors
  if (error.message?.includes('timeout') || error.code === 'ETIMEDOUT') {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.DATABASE_CONNECTION_FAILED,
          message: 'Service temporarily unavailable. Please try again.',
        },
      },
      { status: 503 }
    );
  }

  // Generic server error
  return NextResponse.json(
    {
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_SERVER_ERROR,
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'An unexpected error occurred',
      },
    },
    { status: 500 }
  );
}

// Async error wrapper for API routes
export function asyncHandler(handler: Function) {
  return async (req: any, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Client-side error handler
export function handleClientError(error: any, fallbackMessage: string = 'An error occurred') {
  console.error('Client Error:', error);

  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallbackMessage;
}
