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

interface UpdateById {
  description?: string;
  name?: string;
  mealDate?: Date;
  isOnDiet?: boolean;

  mealId: string;
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

  async updateById({
    description,
    isOnDiet,
    mealDate,
    mealId,
    name,
    userId,
  }: UpdateById): Promise<Meal> {
    const mealFound = await this.mealsRepository.getById(mealId);

    if (!mealFound) {
      throw new NotFoundException('Refeição não encontrada');
    }

    if (mealFound.userId.toString() != userId) {
      throw new UnauthorizedException();
    }

    if (typeof description != 'undefined') mealFound.description = description;
    if (typeof name != 'undefined') mealFound.name = name;
    if (typeof isOnDiet != 'undefined') mealFound.isOnDiet = isOnDiet;
    if (typeof mealDate != 'undefined') mealFound.mealDate = mealDate;

    await this.mealsRepository.save(mealFound);

    return mealFound;
  }

  async getMealsCountByUser(userId: string) {
    const mealsCount = await this.mealsRepository.countByUserId(userId);

    return mealsCount;
  }

  async getMealsCountThatAreOnDiet(userId: string) {
    const mealsCount = await this.mealsRepository.countAllThatAreOnDietByUserId(
      userId,
    );

    return mealsCount;
  }

  async getMealsCountThatAreNotOnDiet(userId: string) {
    const mealsCount =
      await this.mealsRepository.countAllThatAreNotOnDietByUserId(userId);

    return mealsCount;
  }

  async getBestSequence(userId: string) {
    const bestSequence = await this.mealsRepository.countBestSequence(userId);

    return bestSequence;
  }
}
