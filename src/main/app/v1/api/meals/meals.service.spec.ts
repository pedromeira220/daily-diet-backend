import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { makeMeal } from '@test/factories/make-meal';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { addDays } from 'date-fns';
import { Meal } from './entities/meal.entity';
import { MealsService } from './meals.service';
import { InMemoryMealsRepository } from './repository/implementations/in-memory/in-memory-meals-repository';
import { MealsRepository } from './repository/meals-repository';

describe('MealsService', () => {
  let service: MealsService;
  let repository: InMemoryMealsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MealsService,
        {
          provide: MealsRepository,
          useClass: InMemoryMealsRepository,
        },
      ],
    }).compile();

    repository = module.get<InMemoryMealsRepository>(MealsRepository);
    service = module.get<MealsService>(MealsService);
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
      userId: new UniqueEntityId().toString(),
    });

    expect(createdMeal).toBeDefined();
    expect(createdMeal).toBeInstanceOf(Meal);
    expect(typeof createdMeal.id.toString()).toBe('string');
  });

  it('should be able to get an meal by id', async () => {
    const previousCreatedMeal = makeMeal();

    repository.meals.push(previousCreatedMeal);

    const mealFound = await service.getById(
      previousCreatedMeal.id.toString(),
      previousCreatedMeal.userId.toString(),
    );

    expect(mealFound.id.toString()).toBe(previousCreatedMeal.id.toString());
  });

  it('should not be able to get an meal by id that does not exits', async () => {
    expect(async () => {
      await service.getById('fake-id', 'fake-user-id');
    }).rejects.toThrowError(NotFoundException);
  });

  it('should not be able to get an meal from another user', async () => {
    const previousCreatedMeal = makeMeal();

    repository.meals.push(previousCreatedMeal);

    expect(async () => {
      await service.getById(previousCreatedMeal.id.toString(), 'fake-user-id');
    }).rejects.toThrowError(UnauthorizedException);
  });

  it('should be able to delete a meal', async () => {
    const previousCreatedMeal = makeMeal();

    repository.meals.push(previousCreatedMeal);

    await service.deleteById(
      previousCreatedMeal.id.toString(),
      previousCreatedMeal.userId.toString(),
    );

    expect(repository.meals.length).toBe(0);
  });

  it('should not be able to delete an meal from another user', async () => {
    const previousCreatedMeal = makeMeal();

    repository.meals.push(previousCreatedMeal);

    expect(async () => {
      await service.deleteById(
        previousCreatedMeal.id.toString(),
        'fake-user-id',
      );
    }).rejects.toThrowError(UnauthorizedException);
  });

  it('should be able to update a meal', async () => {
    const mealCreationDate = new Date();

    const previousCreatedMeal = makeMeal({
      isOnDiet: true,
      mealDate: mealCreationDate,
    });

    repository.meals.push(previousCreatedMeal);

    const updatedMealCreationDate = addDays(mealCreationDate, 2);

    await service.updateById({
      description: 'Updated description',
      name: 'Updated name',
      isOnDiet: false,
      mealDate: updatedMealCreationDate,
      mealId: previousCreatedMeal.id.toString(),
      userId: previousCreatedMeal.userId.toString(),
    });

    const mealFromRepository = repository.meals.find(
      (meal) => meal.id.toString() == previousCreatedMeal.id.toString(),
    );

    expect(mealFromRepository?.name).toBe('Updated name');
    expect(mealFromRepository?.description).toBe('Updated description');
    expect(mealFromRepository?.isOnDiet).toBe(false);
    expect(mealFromRepository?.mealDate).toBe(updatedMealCreationDate);
  });

  it('should not be able to update an meal from another user', async () => {
    const previousCreatedMeal = makeMeal();

    repository.meals.push(previousCreatedMeal);

    expect(async () => {
      await service.updateById({
        mealId: previousCreatedMeal.id.toString(),
        userId: 'fake-user-id',
      });
    }).rejects.toThrowError(UnauthorizedException);
  });
});
