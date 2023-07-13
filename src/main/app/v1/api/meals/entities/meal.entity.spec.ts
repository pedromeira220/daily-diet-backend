import { makeMeal } from '@test/factories/make-meal';
import { Meal } from './meal.entity';

describe('Meal entity', () => {
  it('should be able to create a meal', () => {
    const meal = makeMeal();

    expect(meal).toBeDefined();
    expect(meal).toBeInstanceOf(Meal);
  });
});
