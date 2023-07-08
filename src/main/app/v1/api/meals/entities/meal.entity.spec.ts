import { Meal } from './meal.entity';

describe('Meal entity', () => {
  it('should be able to create a meal', () => {
    const meal = Meal.create({
      name: 'Pizza',
      description: 'A description test',
      mealDate: new Date(),
      isOnDiet: false,
    });

    expect(meal.name).toBe('Pizza');
    expect(meal).toBeDefined();
    expect(meal).toBeInstanceOf(Meal);
  });
});
