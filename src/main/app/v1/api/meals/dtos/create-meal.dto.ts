import { IsBoolean, IsDateString, IsString, MaxLength } from 'class-validator';

export class CreateMealDTO {
  @IsString()
  @MaxLength(40)
  name: string;

  @IsString()
  @MaxLength(256)
  description: string;

  @IsBoolean()
  isOnDiet: boolean;

  @IsDateString()
  mealDate: Date;
}
