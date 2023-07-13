import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { Meal } from './entities/meal.entity';
import { MealsRepository } from './repository/meals-repository';

interface CreateRequest {
  name: string;
  description: string;
  isOnDiet: boolean;
  mealDate: Date;
  userId: string;
}

@Injectable()
export class MealsService {
  constructor(private mealsRepository: MealsRepository) {}

  async create({
    description,
    isOnDiet,
    mealDate,
    name,
    userId,
  }: CreateRequest): Promise<Meal> {
    const meal = Meal.create({
      name,
      description,
      isOnDiet,
      mealDate,
      userId: new UniqueEntityId(userId),
    });

    await this.mealsRepository.create(meal);

    return meal;
  }

  async getById(mealId: string, userId: string): Promise<Meal> {
    const mealFound = await this.mealsRepository.getById(mealId);

    if (!mealFound) {
      throw new NotFoundException('Refeição não encontrada');
    }

    if (mealFound.userId.toString() != userId) {
      throw new UnauthorizedException();
    }

    return mealFound;
  }

  async deleteById(mealId: string, userId: string): Promise<void> {
    const mealFound = await this.mealsRepository.getById(mealId);

    if (!mealFound) {
      throw new NotFoundException('Refeição não encontrada');
    }

    if (mealFound.userId.toString() != userId) {
      throw new UnauthorizedException();
    }

    await this.mealsRepository.deleteById(mealId);
  }

  async updateById(
    mealId: string,
    updatedMeal: Meal,
    userId: string,
  ): Promise<Meal> {
    const mealFound = await this.mealsRepository.getById(mealId);

    if (!mealFound) {
      throw new NotFoundException('Refeição não encontrada');
    }

    if (mealFound.userId.toString() != userId) {
      throw new UnauthorizedException();
    }

    const ignoreProperties = ['id', 'userId', 'createdAt', 'updatedAt'];

    for (const property in updatedMeal) {
      if (!ignoreProperties.includes(property)) {
        if (typeof mealFound[property] === 'function') {
          mealFound[property](updatedMeal[property]);
        }
      }
    }

    await this.mealsRepository.save(mealFound);

    return mealFound;
  }
}
