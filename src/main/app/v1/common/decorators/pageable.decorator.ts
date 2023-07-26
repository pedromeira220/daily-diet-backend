import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { Pageable } from '../value-objects/pageable';

export const PageableQueryParam = createParamDecorator(
  (data: unknown, context: ExecutionContext): Pageable => {
    const request = context.switchToHttp().getRequest<Request>();

    const pageNumberFromRequest = request.query.pageNumber;
    const pageSizeFromRequest = request.query.pageSize;

    return new Pageable({
      pageNumber: validateValue(
        pageNumberFromRequest,
        'Page number precisa ser um número',
      ),
      pageSize: validateValue(
        pageSizeFromRequest,
        'Page size precisa ser um número',
      ),
    });
  },
);

const validateValue = (
  value: any,
  errorMessage: string,
): number | undefined => {
  if (value != undefined) {
    const numericValue = Number(value);

    if (isNaN(numericValue)) {
      throw new BadRequestException(errorMessage);
    }

    return numericValue;
  }

  return undefined;
};
