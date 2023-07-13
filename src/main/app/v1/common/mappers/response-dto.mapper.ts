import { BooleanDTO } from '../dtos/boolean.dto';
import { NumberDTO } from '../dtos/number.dto';
import { ResponseDTO } from '../dtos/response.dto';
import { StringDTO } from '../dtos/string.dto';

export class ResponseDTOMapper {
  static fromNumber(value: number) {
    return new ResponseDTO({ data: new NumberDTO(value) });
  }
  static fromString(value: string) {
    return new ResponseDTO({ data: new StringDTO(value) });
  }
  static fromBoolean(value: boolean) {
    return new ResponseDTO({ data: new BooleanDTO(value) });
  }
}
