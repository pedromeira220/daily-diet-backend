import { Meal as MealRaw } from '@prisma/client';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';
import { MealDTO } from '../dtos/meal.dto';
import { Meal } from '../entities/meal.entity';

export class MealMapper {
  static toDomain(raw: MealRaw): Meal {
    return Meal.create(
      {
        description: raw.description,
        isOnDiet: raw.in_on_diet,
        mealDate: raw.meal_date,
        name: raw.name,
        userId: new UniqueEntityId(raw.user_id),
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(meal: Meal): MealRaw {
    return {
      created_at: meal.createdAt,
      description: meal.description,
      id: meal.id.toString(),
      in_on_diet: meal.isOnDiet,
      meal_date: meal.mealDate,
      name: meal.name,
      updated_at: meal.updatedAt ?? null,
      user_id: meal.userId.toString(),
    };
  }

  static toHttp(meal: Meal): ResponseDTO<MealDTO> {
    return new ResponseDTO({ data: this.toDTO(meal) });
  }

  static toDTO(meal: Meal): MealDTO {
    return new MealDTO({
      createdAt: meal.createdAt,
      description: meal.description,
      isOnDiet: meal.isOnDiet,
      mealDate: meal.mealDate,
      name: meal.name,
      updatedAt: meal.updatedAt,
      id: meal.id.toString(),
      userId: meal.userId.toString(),
    });
  }
}
