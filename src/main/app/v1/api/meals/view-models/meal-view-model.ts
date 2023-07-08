import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { MealDTO } from '../dtos/meal.dto';
import { Meal } from '../entities/meal.entity';

export class MealViewModel {
  static toHttp(meal: Meal): ResponseDTO<MealDTO> {
    return new ResponseDTO({ data: this.toDTO(meal) });
  }

  static toDTO(meal: Meal): MealDTO {
    return new MealDTO({
      createdAt: meal.createdAt,
      description: meal.description,
      isOnDiet: meal.isOnDiet,
      mealDate: meal.mealDate,
      name: meal.name,
      updatedAt: meal.updatedAt,
      id: meal.id.toString(),
    });
  }
}
