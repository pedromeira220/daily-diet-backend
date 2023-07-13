import { Entity } from '@v1/common/entities/entity.entity';
import { Optional } from '@v1/common/logic/optional';
import { UniqueEntityId } from '@v1/common/value-objects/unique-entity-id';

export interface MealProps {
  name: string;
  description: string;
  isOnDiet: boolean;
  mealDate: Date;
  userId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Meal extends Entity<MealProps> {
  get name() {
    return this.props.name;
  }
  set name(value: string) {
    this.props.name = value;
    this.touch();
  }

  get description() {
    return this.props.description;
  }
  set description(value: string) {
    this.props.description = value;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isOnDiet() {
    return this.props.isOnDiet;
  }
  set isOnDiet(value: boolean) {
    this.props.isOnDiet = value;
    this.touch();
  }

  get mealDate() {
    return this.props.mealDate;
  }
  set mealDate(value: Date) {
    this.props.mealDate = value;
    this.touch();
  }

  get userId() {
    return this.props.userId;
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
