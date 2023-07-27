import {
  Controller,
  HttpCode,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { File } from '@v1/common/value-objects/file';
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

    await this.fileUploaderService.upload(file);

    return { created: 'created' };
  }
}
