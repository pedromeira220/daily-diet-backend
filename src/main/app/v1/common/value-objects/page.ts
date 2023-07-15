export interface PageProps<Data> {
  content: Data[];
  empty: boolean;
  offset: number;
  pageNumber: number;
  pageSize: number;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
}

interface CreateProps<Data> {
  content: Data[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
}

export class Page<Data> {
  private props: PageProps<Data>;

  get content() {
    return this.props.content;
  }
  get empty() {
    return this.props.empty;
  }
  get offset() {
    return this.props.offset;
  }
  get pageNumber() {
    return this.props.pageNumber;
  }
  get pageSize() {
    return this.props.pageSize;
  }
  get last() {
    return this.props.last;
  }
  get totalPages() {
    return this.props.totalPages;
  }
  get totalElements() {
    return this.props.totalElements;
  }
  get first() {
    return this.props.first;
  }

  private constructor(props: PageProps<Data>) {
    this.props = props;
  }

  static create<T>({
    content,
    pageNumber,
    pageSize,
    totalElements,
  }: CreateProps<T>) {
    const totalPages = Math.ceil(totalElements / pageNumber);

    const instance = new Page<T>({
      content,
      pageNumber,
      pageSize,
      totalElements,
      empty: totalElements == 0,
      first: pageNumber == 0,
      totalPages: Math.ceil(totalElements / pageSize),
      last: pageNumber == totalPages - 1,
      offset: pageNumber * pageSize,
    });

    return instance;
  }
}
