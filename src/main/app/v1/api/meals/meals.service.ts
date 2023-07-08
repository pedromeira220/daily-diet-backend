import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getById(mealId: string): Promise<Meal> {
    // TODO: uma refeição só pode ser visualizada pelo usuário que a criou
    const mealFound = await this.mealsRepository.getById(mealId);

    if (!mealFound) {
      throw new NotFoundException('Refeição não encontrada');
    }

    return mealFound;
  }

  async deleteById(mealId: string): Promise<void> {
    // TODO: uma refeição só pode ser deletada pelo usuário a qual a criou

    const mealFound = await this.mealsRepository.getById(mealId);

    if (!mealFound) {
      throw new NotFoundException('Refeição não encontrada');
    }

    await this.mealsRepository.deleteById(mealId);
  }

  async updateById(mealId: string, updatedMeal: Meal): Promise<Meal> {
    // TODO: uma refeição só pode ser atualizada pelo usuário a qual a criou

    const mealFound = await this.mealsRepository.getById(mealId);

    if (!mealFound) {
      throw new NotFoundException('Refeição não encontrada');
    }

    mealFound.name = updatedMeal.name;
    mealFound.description = updatedMeal.description;
    mealFound.mealDate = updatedMeal.mealDate;
    mealFound.isOnDiet = updatedMeal.isOnDiet;

    await this.mealsRepository.save(mealFound);

    return mealFound;
  }
}
