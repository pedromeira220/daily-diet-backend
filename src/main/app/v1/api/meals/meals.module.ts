import { Module } from '@nestjs/common';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';
import { InMemoryMealsRepository } from './repository/implementations/in-memory-meals-repository';
import { MealsRepository } from './repository/meals-repository';

@Module({
  controllers: [MealsController],
  providers: [
    MealsService,
    {
      provide: MealsRepository,
      useClass: InMemoryMealsRepository,
    },
  ],
})
export class MealsModule {}
