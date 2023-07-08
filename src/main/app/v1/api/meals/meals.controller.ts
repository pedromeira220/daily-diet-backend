import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDTO } from '@v1/common/decorators/api-response.decorator';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { CreateMealDTO } from './dtos/create-meal.dto';
import { MealDTO } from './dtos/meal.dto';
import { MealsService } from './meals.service';
import { MealViewModel } from './view-models/meal-view-model';

@Controller('meals')
@ApiTags('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Post()
  @ApiResponseDTO(MealDTO)
  async create(
    @Body() createMealDTO: CreateMealDTO,
  ): Promise<ResponseDTO<MealDTO>> {
    const createdMeal = await this.mealsService.create({
      description: createMealDTO.description,
      isOnDiet: createMealDTO.isOnDiet,
      mealDate: createMealDTO.mealDate,
      name: createMealDTO.name,
    });

    return MealViewModel.toHttp(createdMeal);
  }
}
