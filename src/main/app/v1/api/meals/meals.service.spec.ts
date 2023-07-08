// import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { makeMeal } from '@test/factories/make-meal';
import { Meal } from './entities/meal.entity';
import { MealsService } from './meals.service';
import { InMemoryMealsRepository } from './repository/implementations/in-memory-meals-repository';

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

  it('should be able to get an meal by id', async () => {
    const previousCreatedMeal = makeMeal();

    repository.meals.push(previousCreatedMeal);

    const mealFound = await service.getById(previousCreatedMeal.id.toString());

    expect(mealFound.id.toString()).toBe(previousCreatedMeal.id.toString());
  });

  it('should not be able to get an meal by id that does not exits', async () => {
    expect(async () => {
      await service.getById('fake-id');
    }).rejects.toThrowError(NotFoundException);
  });

  it('should be able to delete a meal', async () => {
    const previousCreatedMeal = makeMeal();

    repository.meals.push(previousCreatedMeal);

    await service.deleteById(previousCreatedMeal.id.toString());

    expect(repository.meals.length).toBe(0);
  });
});
