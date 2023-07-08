import { Injectable } from '@nestjs/common';
import { Meal } from './entities/meal.entity';
import { MealsRepository } from './repository/meals-repository';

interface CreateRequest {
  name: string;
  description: string;
  isOnDiet: boolean;
  mealDate: Date;
}

@Injectable()
export class MealsService {
  constructor(private mealsRepository: MealsRepository) {}

  async create({
    description,
    isOnDiet,
    mealDate,
    name,
  }: CreateRequest): Promise<Meal> {
    const meal = Meal.create({
      name,
      description,
      isOnDiet,
      mealDate,
    });

    await this.mealsRepository.create(meal);

    return meal;
  }
}
