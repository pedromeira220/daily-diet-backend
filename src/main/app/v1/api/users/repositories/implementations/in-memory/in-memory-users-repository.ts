import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users-repository';
import { User } from '@v1/api/users/entities/user.entity';

@Injectable()
export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = [];

  async getById(userId: string): Promise<User | null> {
    const userFromArray = this.users.find(
      (user) => user.id.toValue() == userId,
    );

    if (!userFromArray) {
      return null;
    }

    return userFromArray;
  }

  async create(user: User): Promise<void> {
    this.users.push(user);
  }

  async getByEmail(userEmail: string): Promise<User | null> {
    const userFromArray = this.users.find((user) => user.email == userEmail);

    if (!userFromArray) {
      return null;
    }

    return userFromArray;
  }
}
