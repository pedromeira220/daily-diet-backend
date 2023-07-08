interface MealDTOProps {
  id: string;
  name: string;
  description: string;
  isOnDiet: boolean;
  mealDate: Date;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class MealDTO implements MealDTOProps {
  id: string;
  name: string;
  description: string;
  isOnDiet: boolean;
  mealDate: Date;
  createdAt: Date;
  updatedAt?: Date | null;

  constructor({
    id,
    createdAt,
    description,
    isOnDiet,
    mealDate,
    name,
    updatedAt,
  }: MealDTOProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isOnDiet = isOnDiet;
    this.mealDate = mealDate;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
