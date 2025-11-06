import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  public readonly client: S3Client;
  public readonly bucket: string;
  private readonly region?: string;
  private readonly endpoint?: string;
  private readonly forcePathStyle?: boolean;

  constructor() {
    this.bucket = process.env.AWS_S3_BUCKET as string;
    this.region = process.env.AWS_REGION;
    this.endpoint = process.env.AWS_S3_ENDPOINT;
    this.forcePathStyle =
      (process.env.AWS_S3_FORCE_PATH_STYLE ?? '').toLowerCase() === 'true';

    this.client = new S3Client({
      region: this.region,
      endpoint: this.endpoint,
      forcePathStyle: this.forcePathStyle,
      credentials:
        process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
          ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          }
          : undefined,
    });
  }

  async deleteObject(key: string) {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
  }

  publicUrl(key: string) {
    if (this.endpoint) {
      if (this.forcePathStyle) {
        return `${this.endpoint.replace(/\/$/, '')}/${this.bucket}/${encodeURI(
          key,
        )}`;
      }
      const url = new URL(this.endpoint);
      return `${url.protocol}//${this.bucket}.${url.host}/${encodeURI(key)}`;
    }

    const r = this.region ?? 'us-east-1';
    const path =
      r === 'us-east-1'
        ? `https://${this.bucket}.s3.amazonaws.com/${encodeURI(key)}`
        : `https://${this.bucket}.s3.${r}.amazonaws.com/${encodeURI(key)}`;
    return path;
  }
}
