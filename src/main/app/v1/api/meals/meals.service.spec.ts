import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { makeMeal } from '@test/factories/make-meal';
import { Pageable } from '@v1/common/value-objects/pageable';
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

  it('should count meals from user', async () => {
    const MEALS_COUNT = 5;
    const userId = 'user-id';

    for (let i = 0; i < MEALS_COUNT; i++) {
      repository.meals.push(
        makeMeal({
          userId: new UniqueEntityId(userId),
        }),
      );
    }

    const mealsCountFromService = await service.getMealsCountByUser(userId);

    expect(mealsCountFromService).toBe(MEALS_COUNT);
  });

  it('should count meals from user that are on diet', async () => {
    const MEALS_COUNT_THAT_ARE_ON_DIET = 10;
    const MEALS_COUNT_THAT_ARE_NOT_ON_DIET = 7;
    const userId = 'user-id';

    for (let i = 0; i < MEALS_COUNT_THAT_ARE_ON_DIET; i++) {
      repository.meals.push(
        makeMeal({
          userId: new UniqueEntityId(userId),
          isOnDiet: true,
        }),
      );
    }

    for (let i = 0; i < MEALS_COUNT_THAT_ARE_NOT_ON_DIET; i++) {
      repository.meals.push(
        makeMeal({
          userId: new UniqueEntityId(userId),
          isOnDiet: false,
        }),
      );
    }

    const mealsCountFromService = await service.getMealsCountThatAreOnDiet(
      userId,
    );

    expect(mealsCountFromService).toBe(MEALS_COUNT_THAT_ARE_ON_DIET);
  });

  it('should count meals from user that are not on diet', async () => {
    const MEALS_COUNT_THAT_ARE_ON_DIET = 10;
    const MEALS_COUNT_THAT_ARE_NOT_ON_DIET = 7;
    const userId = 'user-id';

    for (let i = 0; i < MEALS_COUNT_THAT_ARE_ON_DIET; i++) {
      repository.meals.push(
        makeMeal({
          userId: new UniqueEntityId(userId),
          isOnDiet: true,
        }),
      );
    }

    for (let i = 0; i < MEALS_COUNT_THAT_ARE_NOT_ON_DIET; i++) {
      repository.meals.push(
        makeMeal({
          userId: new UniqueEntityId(userId),
          isOnDiet: false,
        }),
      );
    }

    const mealsCountFromService = await service.getMealsCountThatAreNotOnDiet(
      userId,
    );

    expect(mealsCountFromService).toBe(MEALS_COUNT_THAT_ARE_NOT_ON_DIET);
  });

  it('should count meals best sequence with 4 best sequence', async () => {
    const userId = 'user-id';
    const bestSequence = 4;

    const daysOnDiet = [
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      true,
      true,
      false,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
    ];

    daysOnDiet.forEach((currentDayIsOnDiet, index) => {
      repository.meals.push(
        makeMeal({
          userId: new UniqueEntityId(userId),
          isOnDiet: currentDayIsOnDiet,
          mealDate: addDays(new Date(), index),
        }),
      );
    });

    const mealsCountFromService = await service.getBestSequence(userId);

    expect(mealsCountFromService).toBe(bestSequence);
  });

  it('should count meals best sequence with 0 best sequence', async () => {
    const userId = 'user-id';
    const bestSequence = 0;

    const daysOnDiet = [
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ];

    daysOnDiet.forEach((currentDayIsOnDiet, index) => {
      repository.meals.push(
        makeMeal({
          userId: new UniqueEntityId(userId),
          isOnDiet: currentDayIsOnDiet,
          mealDate: addDays(new Date(), index),
        }),
      );
    });

    const mealsCountFromService = await service.getBestSequence(userId);

    expect(mealsCountFromService).toBe(bestSequence);
  });

  it('should count meals best sequence with 2 best sequence', async () => {
    const userId = 'user-id';
    const bestSequence = 2;

    const daysOnDiet = [
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      true,
      true,
      false,
      false,
      false,
      false,
      true,
      true,
    ];

    daysOnDiet.forEach((currentDayIsOnDiet, index) => {
      repository.meals.push(
        makeMeal({
          userId: new UniqueEntityId(userId),
          isOnDiet: currentDayIsOnDiet,
          mealDate: addDays(new Date(), index),
        }),
      );
    });

    const mealsCountFromService = await service.getBestSequence(userId);

    expect(mealsCountFromService).toBe(bestSequence);
  });

  it('should return meals from user paginated', async () => {
    const MEALS_COUNT = 22;
    const userId = 'user-id';
    const pageSize = 20;

    for (let i = 0; i < MEALS_COUNT; i++) {
      repository.meals.push(
        makeMeal({
          name: `Meal ${i}`,
          userId: new UniqueEntityId(userId),
        }),
      );
    }

    let paginatedMeals = await service.getAllFromUser(
      userId,
      new Pageable({
        pageNumber: 0,
        pageSize: 20,
      }),
    );

    expect(paginatedMeals.content.length).toBe(pageSize);
    expect(paginatedMeals.first).toBe(true);
    expect(paginatedMeals.empty).toBe(false);
    expect(paginatedMeals.totalPages).toBe(2);
    expect(paginatedMeals.totalElements).toBe(MEALS_COUNT);

    paginatedMeals = await service.getAllFromUser(
      userId,
      new Pageable({
        pageNumber: 1,
        pageSize: 20,
      }),
    );

    expect(paginatedMeals.content.length).toBe(2);
    expect(paginatedMeals.first).toBe(false);
    expect(paginatedMeals.empty).toBe(false);
    expect(paginatedMeals.totalPages).toBe(2);
    expect(paginatedMeals.totalElements).toBe(MEALS_COUNT);
  });
});
