import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseDTO } from '@v1/common/dtos/response.dto';
import { File } from '@v1/common/value-objects/file';
import { Response } from 'express';
import { ImageSourceDTO } from './dtos/image-source.dto';
import { FileUploaderService } from './file-uploader.service';
import { ImageSourceMapper } from './mappers/image-source.mapper';

@Controller('file-uploader')
export class FileUploaderController {
  constructor(private readonly fileUploaderService: FileUploaderService) { }

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
    expressFile: Express.Multer.File,
  ): Promise<ResponseDTO<ImageSourceDTO>> {
    const imageSource = await this.fileUploaderService.upload(
      File.fromExpressFile(expressFile),
    );

    return ImageSourceMapper.toHttp(imageSource);
  }

  @Get('image/:fileName')
  async getImage(@Param('fileName') fileName: string, @Res() res: Response) {
    const { file } = await this.fileUploaderService.getFile(fileName);

    return res.sendFile(file.path);
  }
}
