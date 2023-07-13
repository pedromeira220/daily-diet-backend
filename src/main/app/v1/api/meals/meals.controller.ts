import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseDTO } from '@v1/common/decorators/api-response.decorator';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/models/auth-user.model';
import { CreateMealDTO } from './dtos/create-meal.dto';
import { MealDTO } from './dtos/meal.dto';
import { UpdateMealDTO } from './dtos/update-meal.dto';
import { MealMapper } from './mappers/meal.mapper';
import { MealsService } from './meals.service';

@Controller('meals')
@ApiTags('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  /*
   * Cria uma nova refeição
   */
  @Post()
  @ApiResponseDTO(MealDTO)
  async create(
    @Body() createMealDTO: CreateMealDTO,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ResponseDTO<MealDTO>> {
    const createdMeal = await this.mealsService.create({
      description: createMealDTO.description,
      isOnDiet: createMealDTO.isOnDiet,
      mealDate: createMealDTO.mealDate,
      name: createMealDTO.name,
      userId: currentUser.userId,
    });

    return MealMapper.toHttp(createdMeal);
  }

  @Get(':id')
  @ApiResponseDTO(MealDTO)
  async getById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<ResponseDTO<MealDTO>> {
    const meal = await this.mealsService.getById(id, currentUser.userId);

    return MealMapper.toHttp(meal);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<void> {
    await this.mealsService.deleteById(id, currentUser.userId);
  }

  @Put(':id')
  @ApiResponseDTO(MealDTO)
  async updateById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() currentUser: AuthUser,
    @Body() dto: UpdateMealDTO,
  ): Promise<ResponseDTO<MealDTO>> {
    const updatedMealFromService = await this.mealsService.updateById({
      mealId: id,
      userId: currentUser.userId,
      description: dto.description,
      isOnDiet: dto.isOnDiet,
      mealDate: dto.mealDate,
      name: dto.name,
    });

    return MealMapper.toHttp(updatedMealFromService);
  }
}
