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

    /*
    
    s n s s n n n s s s s n s n n n n s s s 

    melhor - 4
    atual - 3

    o dia atual está na dieta
      soma 1 no contador atual 
      o anterior está na dieta 
        se o contador atual for maior que a melhor sequencia, a melhor sequencia é igual o atual
    caso contrário 
      atual = 0


    resultado = 4
    
    */
  }
}
