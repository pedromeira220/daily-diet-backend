import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { PrismaMealsRepository } from './repository/implementations/prisma/prisma-meals-respository';
import { MealsRepository } from './repository/meals-repository';

@Module({
  controllers: [MealsController],
  providers: [
    MealsService,
    {
      provide: MealsRepository,
      useClass: PrismaMealsRepository,
    },
  ],
})
export class MealsModule {}
