import { Injectable } from '@nestjs/common';
import { PrismaService } from '@v1/database/prisma/prisma.service';
import { ImageSource } from '../../entities/image-source.entity';
import { ImageSourceMapper } from '../../mappers/image-source.mapper';
import { ImageSourceRepository } from '../image-source.repository';

@Injectable()
export class PrismaImageSourceRepository implements ImageSourceRepository {
  constructor(private prisma: PrismaService) {}

  async create(imageSource: ImageSource): Promise<void> {
    await this.prisma.imageSource.create({
      data: ImageSourceMapper.toPrisma(imageSource),
    });
  }
}
