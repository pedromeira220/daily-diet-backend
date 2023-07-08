import { Injectable } from '@nestjs/common';
import { MealsRepository } from '../meals-repository';
import { Meal } from '../../entities/meal.entity';

@Injectable()
export class InMemoryMealsRepository implements MealsRepository {
  public meals: Meal[] = [];

  async create(meal: Meal): Promise<void> {
    this.meals.push(meal);
  }
}
