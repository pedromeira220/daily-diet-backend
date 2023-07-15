import { Page } from '@v1/common/value-objects/page';
import { Pageable } from '@v1/common/value-objects/pageable';
import { Meal } from '../entities/meal.entity';

export abstract class MealsRepository {
  abstract create(meal: Meal): Promise<void>;
  abstract getById(mealId: string): Promise<Meal | null>;
  abstract deleteById(mealId: string): Promise<void>;
  abstract save(meal: Meal): Promise<void>;
  abstract countByUserId(userId: string): Promise<number>;
  abstract countAllThatAreOnDietByUserId(userId: string): Promise<number>;
  abstract countAllThatAreNotOnDietByUserId(userId: string): Promise<number>;
  abstract countBestSequence(userId: string): Promise<number>;
  abstract findAllByUserId(
    userId: string,
    pageable: Pageable,
  ): Promise<Page<Meal>>;
}
