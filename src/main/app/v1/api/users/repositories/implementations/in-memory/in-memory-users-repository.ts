import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '@v1/api/users/entities/application-user.entity';
import { UsersRepository } from '../../users-repository';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  public users: ApplicationUser[] = [];

  async getById(userId: string): Promise<ApplicationUser | null> {
    const userFromArray = this.users.find(
      (user) => user.id.toValue() == userId,
    );

    if (!userFromArray) {
      return null;
    }

    return userFromArray;
  }

  async create(user: ApplicationUser): Promise<void> {
    this.users.push(user);
  }

  async getByEmail(userEmail: string): Promise<ApplicationUser | null> {
    const userFromArray = this.users.find((user) => user.email == userEmail);

    if (!userFromArray) {
      return null;
    }

    return userFromArray;
  }

  async save(user: ApplicationUser): Promise<void> {
    const userIndex = this.users.findIndex(
      (currentUser) => currentUser.id.toString() == user.id.toString(),
    );

    this.users[userIndex] = user;
  }
}
