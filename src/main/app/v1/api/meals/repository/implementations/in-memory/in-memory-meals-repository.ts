import { Injectable } from '@nestjs/common';
import { Page } from '@v1/common/value-objects/page';
import { Pageable } from '@v1/common/value-objects/pageable';
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

  async countByUserId(userId: string): Promise<number> {
    return this.meals.filter((meal) => meal.userId.toString() === userId)
      .length;
  }

  async countAllThatAreOnDietByUserId(userId: string): Promise<number> {
    return this.meals.filter(
      (meal) => meal.userId.toString() === userId && meal.isOnDiet === true,
    ).length;
  }

  async countAllThatAreNotOnDietByUserId(userId: string): Promise<number> {
    return this.meals.filter(
      (meal) => meal.userId.toString() === userId && meal.isOnDiet === false,
    ).length;
  }

  async countBestSequence(userId: string): Promise<number> {
    let bestSequenceCount = 0;
    let currentCount = 0;
    let previousDayWasOnDiet = true;

    const mealsFromUser = this.meals.filter(
      (meal) => meal.userId.toString() === userId,
    );

    const sortedMealsByMealDate = mealsFromUser.sort(
      (a, b) => a.mealDate.getTime() - b.mealDate.getTime(),
    );

    sortedMealsByMealDate.forEach((meal) => {
      if (meal.isOnDiet) {
        currentCount = currentCount + 1;

        if (previousDayWasOnDiet) {
          if (currentCount > bestSequenceCount) {
            bestSequenceCount = currentCount;
          }
        }

        previousDayWasOnDiet = true;
      } else {
        currentCount = 0;

        previousDayWasOnDiet = false;
      }
    });

    if (currentCount > bestSequenceCount) {
      bestSequenceCount = currentCount;
    }

    return bestSequenceCount;
  }

  async findAllByUserId(
    userId: string,
    pageable: Pageable,
  ): Promise<Page<Meal>> {
    const mealsFromUser = this.meals.filter(
      (meal) => meal.userId.toString() == userId,
    );

    console.log('> mealsFromUser', mealsFromUser.length);

    console.log('> pageable', pageable);
    console.log({
      start: pageable.pageSize * pageable.pageNumber,
      end: pageable.pageSize * (pageable.pageNumber + 1),
    });

    const paginatedMeals = mealsFromUser.slice(
      pageable.pageSize * pageable.pageNumber,
      pageable.pageSize * (pageable.pageNumber + 1),
    );

    console.log('> paginatedMeals', paginatedMeals.length);

    return Page.create({
      content: paginatedMeals,
      pageNumber: pageable.pageNumber,
      pageSize: pageable.pageSize,
      totalElements: mealsFromUser.length,
    });
  }
}
