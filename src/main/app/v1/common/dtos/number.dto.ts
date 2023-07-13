import { IsNumber } from 'class-validator';

export class NumberDTO {
  @IsNumber()
  value: number;

  constructor(value: number) {
    this.value = value;
  }
}
