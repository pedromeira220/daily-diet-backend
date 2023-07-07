import { ApiProperty } from '@nestjs/swagger';

export class ResponseDTO<Data> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  errors: string[];

  @ApiProperty({ type: () => Object }) // Define o tipo do objeto data
  data: Data | null;

  public constructor({ data, errors, success }: Partial<ResponseDTO<Data>>) {
    this.data = data ?? null;
    this.errors = errors ?? [];
    this.success = success ?? true;
  }
}
