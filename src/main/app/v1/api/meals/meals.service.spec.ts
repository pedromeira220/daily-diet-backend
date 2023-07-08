import { Test, TestingModule } from '@nestjs/testing';
import { MealsService } from './meals.service';
import { InMemoryMealsRepository } from './repository/implementations/in-memory-meals-repository';
import { makeMeal } from 'test/factories/make-meal';
import { Meal } from './entities/meal.entity';

describe('MealsService', () => {
  let service: MealsService;
  let repository: InMemoryMealsRepository;

  beforeEach(async () => {
    /*   const module: TestingModule = await Test.createTestingModule({
      providers: [MealsService],
    }).compile(); */

    repository = new InMemoryMealsRepository();
    service = new MealsService(repository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to create a new meal', async () => {
    const createdMeal = await service.create({
      name: 'Salad',
      description: 'A simple salad',
      isOnDiet: true,
      mealDate: new Date(),
    });

    expect(createdMeal).toBeDefined();
    expect(createdMeal).toBeInstanceOf(Meal);
    expect(typeof createdMeal.id.toString()).toBe('string');
  });
});
