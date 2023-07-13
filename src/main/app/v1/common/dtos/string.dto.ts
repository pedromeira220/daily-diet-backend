import { IsString } from 'class-validator';

export class StringDTO {
  @IsString()
  value: string;

  constructor(value: string) {
    this.value = value;
  }
}
