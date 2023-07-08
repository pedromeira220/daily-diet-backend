import { Meal } from '../entities/meal.entity';

export abstract class MealsRepository {
  abstract create(meal: Meal): Promise<void>;
  abstract getById(mealId: string): Promise<Meal | null>;
  abstract deleteById(mealId: string): Promise<void>;
}
