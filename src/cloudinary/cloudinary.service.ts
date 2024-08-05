import { Injectable } from '@nestjs/common';
import { UploadApiResponse, v2 } from 'cloudinary';
import * as fs from 'fs';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> { 
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { folder: 'Blog Images' },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      const readStream = fs.createReadStream(file.path);
      readStream.pipe(upload);
    });
  }
}
