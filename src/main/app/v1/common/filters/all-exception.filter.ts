import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDTO } from '../dtos/response.dto';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const httpCtx = host.switchToHttp();
    const response = httpCtx.getResponse<Response>();
    const request = httpCtx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errors: string[] = [];

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse() as any;
      const message = exception.message;

      if (typeof errorResponse === 'object' && errorResponse['message']) {
        if (
          Array.isArray(errorResponse['message']) &&
          errorResponse['message'].length > 0
        ) {
          errors.push(...errorResponse['message']);
        } else {
          errors.push(errorResponse['message']);
        }
      } else if (Array.isArray(errorResponse) && errorResponse.length > 0) {
        errors = errorResponse;
      } else {
        errors.push(message || 'Internal server error');
      }
    }

    return response.status(status).json(
      new ResponseDTO({
        success: false,
        errors: errors.length == 0 ? ['Internal server error'] : errors,
        data: undefined,
      }),
    );
  }
}
