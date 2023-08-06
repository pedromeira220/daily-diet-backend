import { EnvConfigService } from '@core/config/app-config.service';
import { Injectable } from '@nestjs/common';
import { File } from '@v1/common/value-objects/file';
import * as AWS from 'aws-sdk';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { Readable } from 'node:stream';
import { ImageSource, Origin } from '../../entities/image-source.entity';
import { FileUploaderAdapter } from '../file-uploader.adpater';

interface S3UploadParams {
  file: Buffer | Uint8Array | Blob | string | Readable;
  name: string;
  mimetype: string;
}
@Injectable()
export class AwsS3FileUploadedAdapter implements FileUploaderAdapter {
  private AWS_S3_BUCKET: string;
  private s3: AWS.S3;

  constructor(private readonly envConfigService: EnvConfigService) {
    this.AWS_S3_BUCKET = this.envConfigService.AWS_S3_BUCKET;
    this.s3 = new AWS.S3({
      accessKeyId: this.envConfigService.AWS_ACCESS_KEY_ID,
      secretAccessKey: this.envConfigService.AWS_SECRET_ACCESS_KEY,
    });
  }

  async upload(file: File): Promise<ImageSource> {
    const fileId = randomUUID();
    const extension = extname(file.originalname);

    const fileName = fileId.concat(extension);

    const s3Response = await this.s3Upload({
      file: file.buffer,
      name: fileName,
      mimetype: file.mimetype,
    });

    return ImageSource.create({
      origin: Origin.AWS_S3,
      fileName,
      src: s3Response.Location,
    });
  }

  async s3Upload({ file, mimetype, name }: S3UploadParams) {
    /*    const params = {
      Bucket: this.AWS_S3_BUCKET,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    }; */

    try {
      const s3Response = await this.s3
        .upload({
          Bucket: this.AWS_S3_BUCKET,
          Key: String(name),
          Body: file,
          ContentType: mimetype,
          ACL: 'public-read',
          ContentDisposition: 'inline',
        })
        .promise();
      return s3Response;
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao enviar arquivo ao s3');
    }
  }
}
