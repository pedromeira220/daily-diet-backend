interface PageDTOProps<DTO> {
  content: DTO[];
  empty: boolean;
  offset: number;
  pageNumber: number;
  pageSize: number;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
}

export class PageDTO<DTO> implements PageDTOProps<DTO> {
  content: DTO[];
  empty: boolean;
  offset: number;
  pageNumber: number;
  pageSize: number;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;

  constructor(props: PageDTOProps<DTO>) {
    this.content = props.content;
    this.empty = props.empty;
    this.offset = props.offset;
    this.pageNumber = props.pageNumber;
    this.pageSize = props.pageSize;
    this.last = props.last;
    this.totalPages = props.totalPages;
    this.totalElements = props.totalElements;
    this.first = props.first;
  }
}
