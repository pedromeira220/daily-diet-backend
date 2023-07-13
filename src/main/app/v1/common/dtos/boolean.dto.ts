import { IsBoolean } from 'class-validator';

export class BooleanDTO {
  @IsBoolean()
  value: boolean;

  constructor(value: boolean) {
    this.value = value;
  }
}
