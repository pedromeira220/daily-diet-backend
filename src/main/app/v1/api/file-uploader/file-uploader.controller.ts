import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { File } from '@v1/common/value-objects/file';
import { Response } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'path';
import { FileUploaderService } from './file-uploader.service';

@ApiTags('file-uploader')
@Controller('file-uploader')
export class FileUploaderController {
  constructor(private readonly fileUploaderService: FileUploaderService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 1024 * 10, // 10 megabytes
        })
        .build({
          errorHttpStatusCode: HttpStatus.PAYLOAD_TOO_LARGE,
          fileIsRequired: true,
        }),
    )
    file: File,
  ) {
    console.log('> file', file);

    const { fileName } = await this.fileUploaderService.upload(file);

    return { fileName };
  }

  @Get('get-file/:fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    const uploadDir = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      '..',
      'uploads',
    );

    const filePath = join(uploadDir, fileName);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');
    }

    return res.sendFile(filePath);
  }
}
