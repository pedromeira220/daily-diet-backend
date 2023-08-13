import { Injectable } from '@nestjs/common';
import { ApplicationUser } from '@v1/api/users/entities/application-user.entity';
import { UserMapper } from '@v1/api/users/mappers/user.mapper';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import { UsersRepository } from '../../users-repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async getById(userId: string): Promise<ApplicationUser | null> {
    const userFromDb = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userFromDb) {
      return null;
    }

    return UserMapper.toDomain(userFromDb);
  }

  async getByEmail(userEmail: string): Promise<ApplicationUser | null> {
    const userFromDb = await this.prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });

    if (!userFromDb) {
      return null;
    }

    return UserMapper.toDomain(userFromDb);
  }

  async create(user: ApplicationUser): Promise<void> {
    const raw = UserMapper.toPrisma(user);

    await this.prisma.user.create({
      data: raw,
    });
  }

  async save(user: ApplicationUser): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data: UserMapper.toPrisma(user),
    });
  }
}
