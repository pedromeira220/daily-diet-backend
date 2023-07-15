import { BadRequestException } from '@nestjs/common';
import { Optional } from '@v1/common/logic/optional';
export interface PageableProps {
  pageNumber: number;
  pageSize: number;
}

export class Pageable {
  private props: PageableProps;

  get pageNumber() {
    return this.props.pageNumber;
  }

  get pageSize() {
    return this.props.pageSize;
  }

  constructor(props: Optional<PageableProps, 'pageNumber' | 'pageSize'>) {
    if (props?.pageSize == 0) {
      throw new BadRequestException('Page number cannot be 0');
    }

    this.props = {
      pageNumber: props.pageNumber ?? 0,
      pageSize: props.pageSize ?? 20,
    };
  }
}
