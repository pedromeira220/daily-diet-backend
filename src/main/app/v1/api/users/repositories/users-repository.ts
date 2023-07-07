import { User } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract getById(userId: string): Promise<User | null>;
  abstract getByEmail(userEmail: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
}
