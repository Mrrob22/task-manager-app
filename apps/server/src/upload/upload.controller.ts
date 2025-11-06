import { Body, Controller, Post } from '@nestjs/common';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Service } from './s3.service';

type PresignBody = { filename: string; type?: string };

@Controller('api/upload')
export class UploadController {
  constructor(private readonly s3: S3Service) {}

  @Post('presign')
  async presign(@Body() body: PresignBody) {
    const safeName = (body.filename ?? 'file').replace(/\s+/g, '_');
    const key = `uploads/${Date.now()}-${safeName}`;

    const cmd = new PutObjectCommand({
      Bucket: this.s3.bucket,
      Key: key,
      ContentType: body.type || 'application/octet-stream',
    });

    const uploadUrl = await getSignedUrl(this.s3.client, cmd, {
      expiresIn: 60 * 10,
    });

    return {
      uploadUrl,
      key,
      fileUrl: this.s3.publicUrl(key),
    };
  }
}
