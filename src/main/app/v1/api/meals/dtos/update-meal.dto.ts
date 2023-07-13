import { PartialType } from '@nestjs/mapped-types';
import { CreateMealDTO } from './create-meal.dto';

export class UpdateMealDTO extends PartialType(CreateMealDTO) {}
