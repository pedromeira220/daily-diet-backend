import { Meal } from '../entities/meal.entity';

export abstract class MealsRepository {
  abstract create(meal: Meal): Promise<void>;
}
