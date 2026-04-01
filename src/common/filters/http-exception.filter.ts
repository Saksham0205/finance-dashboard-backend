import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'Internal Server Error';
    let detail = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, unknown>;
        if (resp.error && resp.detail) {
          error = resp.error as string;
          detail = resp.detail as string;
        } else {
          error = (resp.error as string) || (resp.message as string) || exception.message;
          detail =
            typeof resp.message === 'string'
              ? resp.message
              : Array.isArray(resp.message)
                ? (resp.message as string[]).join('; ')
                : exception.message;
        }
      } else {
        error = exception.message;
        detail = exception.message;
      }
    }

    response.status(status).json({ error, detail });
  }
}
