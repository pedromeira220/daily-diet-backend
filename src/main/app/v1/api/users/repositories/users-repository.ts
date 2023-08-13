import { ApplicationUser } from '../entities/application-user.entity';

export abstract class UsersRepository {
  abstract getById(userId: string): Promise<ApplicationUser | null>;
  abstract getByEmail(userEmail: string): Promise<ApplicationUser | null>;
  abstract create(user: ApplicationUser): Promise<void>;
  abstract save(user: ApplicationUser): Promise<void>;
}
