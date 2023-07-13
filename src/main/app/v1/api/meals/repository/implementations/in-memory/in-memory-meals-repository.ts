import { Injectable } from '@nestjs/common';
import { Meal } from '../../../entities/meal.entity';
import { MealsRepository } from '../../meals-repository';

@Injectable()
export class InMemoryMealsRepository implements MealsRepository {
  public meals: Meal[] = [];

  async create(meal: Meal): Promise<void> {
    this.meals.push(meal);
  }

  async getById(mealId: string): Promise<Meal | null> {
    const mealFound = this.meals.find((meal) => meal.id.toString() == mealId);

    if (!mealFound) {
      return null;
    }

    return mealFound;
  }

  async deleteById(mealId: string): Promise<void> {
    const mealIndex = this.meals.findIndex(
      (meal) => meal.id.toString() == mealId,
    );

    this.meals.splice(mealIndex, 1);
  }

  async save(meal: Meal): Promise<void> {
    const mealIndex = this.meals.findIndex(
      (meal) => meal.id.toString() == meal.id.toString(),
    );

    this.meals[mealIndex] = meal;
  }
}
