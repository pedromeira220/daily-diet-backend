import { Injectable } from '@nestjs/common';
import { Meal } from '@v1/api/meals/entities/meal.entity';
import { MealMapper } from '@v1/api/meals/mappers/meal.mapper';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import { MealsRepository } from '../../meals-repository';

@Injectable()
export class PrismaMealsRepository implements MealsRepository {
  constructor(private prisma: PrismaService) {}

  async create(meal: Meal): Promise<void> {
    await this.prisma.meal.create({
      data: MealMapper.toPrisma(meal),
    });
  }
  async getById(mealId: string): Promise<Meal | null> {
    const mealFound = await this.prisma.meal.findUnique({
      where: {
        id: mealId,
      },
    });

    if (!mealFound) {
      return null;
    }

    return MealMapper.toDomain(mealFound);
  }
  async deleteById(mealId: string): Promise<void> {
    await this.prisma.meal.delete({
      where: {
        id: mealId,
      },
    });
  }
  async save(meal: Meal): Promise<void> {
    await this.prisma.meal.update({
      where: {
        id: meal.id.toString(),
      },
      data: MealMapper.toPrisma(meal),
    });
  }

  async countByUserId(userId: string): Promise<number> {
    const mealsCount = await this.prisma.meal.count({
      where: {
        user_id: userId,
      },
    });

    return mealsCount;
  }

  async countAllThatAreOnDietByUserId(userId: string): Promise<number> {
    const mealsCount = await this.prisma.meal.count({
      where: {
        user_id: userId,
        is_on_diet: true,
      },
    });

    return mealsCount;
  }

  async countAllThatAreNotOnDietByUserId(userId: string): Promise<number> {
    const mealsCount = await this.prisma.meal.count({
      where: {
        user_id: userId,
        is_on_diet: false,
      },
    });

    return mealsCount;
  }
}
