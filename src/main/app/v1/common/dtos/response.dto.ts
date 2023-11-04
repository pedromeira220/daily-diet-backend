export class ResponseDTO<Data> {
  success: boolean;

  errors: string[];

  data: Data | undefined;

  public constructor({ data, errors, success }: Partial<ResponseDTO<Data>>) {
    this.data = data;
    this.errors = errors ?? [];
    this.success = success ?? true;
  }
}
