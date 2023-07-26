import { PageDTO } from '../dtos/page.dto';
import { ResponseDTO } from '../dtos/response.dto';
import { Page } from '../value-objects/page';

export class PageMapper {
  static toHttp<DTO>(page: Page<any>, DTOs: DTO[]): ResponseDTO<PageDTO<DTO>> {
    return new ResponseDTO({ data: this.toDTO<DTO>(page, DTOs) });
  }

  static toDTO<DTO>(page: Page<DTO>, DTOs: DTO[]): PageDTO<DTO> {
    return new PageDTO<DTO>({
      content: DTOs,
      empty: page.empty,
      first: page.first,
      last: page.last,
      offset: page.offset,
      pageNumber: page.pageNumber,
      pageSize: page.pageSize,
      totalElements: page.totalElements,
      totalPages: page.totalPages,
    });
  }
}
