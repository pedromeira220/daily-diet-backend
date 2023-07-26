import { Injectable } from '@nestjs/common';
import { Meal } from '@v1/api/meals/entities/meal.entity';
import { MealMapper } from '@v1/api/meals/mappers/meal.mapper';
import { Page } from '@v1/common/value-objects/page';
import { Pageable } from '@v1/common/value-objects/pageable';
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

  async countBestSequence(userId: string): Promise<number> {
    const result = (await this.prisma.$queryRaw`
      SELECT meal_date, is_on_diet,
        COUNT(*) FILTER (WHERE is_on_diet = true) OVER (ORDER BY meal_date) AS sequence_count
      FROM meals
      WHERE user_id = ${userId}
      ORDER BY meal_date
    `) as any;

    let bestSequenceCount = 0;
    let currentCount = 0;

    for (const row of result) {
      if (row.is_on_diet) {
        currentCount++;
        if (currentCount > bestSequenceCount) {
          bestSequenceCount = currentCount;
        }
      } else {
        currentCount = 0;
      }
    }

    return bestSequenceCount;
  }

  async findAllByUserId(
    userId: string,
    pageable: Pageable,
  ): Promise<Page<Meal>> {
    const mealsFromUser = await this.prisma.meal.findMany({
      where: {
        user_id: userId,
      },
      skip: pageable.pageNumber * (pageable.pageSize - 1),
    });

    const totalElements = await this.prisma.meal.count({
      where: {
        user_id: userId,
      },
    });

    return Page.create({
      content: mealsFromUser.map((mealRaw) => MealMapper.toDomain(mealRaw)),
      pageNumber: pageable.pageNumber,
      pageSize: pageable.pageSize,
      totalElements,
    });
  }
}
