import { Entity } from '@v1/common/entities/entity.entity';
import { Optional } from '@v1/common/logic/optional';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';

export interface MealProps {
  name: string;
  description: string;
  isOnDiet: boolean;
  mealDate: Date;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Meal extends Entity<MealProps> {
  get name() {
    return this.props.name;
  }
  get description() {
    return this.props.description;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get isOnDiet() {
    return this.props.isOnDiet;
  }
  get mealDate() {
    return this.props.mealDate;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<MealProps, 'createdAt'>, id?: UniqueEntityId) {
    const meal = new Meal(
      {
        ...props,
        mealDate: props.mealDate,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
      },
      id,
    );

    return meal;
  }
}
