import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Upload } from '../upload.entity';
import { Repository } from 'typeorm';
import { UploadToAwsProvider } from './upload-to-aws.provider';
import { ConfigService } from '@nestjs/config';
import { UploadFile } from '../interfaces/upload-file.interface';
import { fileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly uploadToAwsProvider: UploadToAwsProvider,
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
  ) {}
  public async uploadFile(file: Express.Multer.File): Promise<UploadFile> {
    if (
      !['image/jpeg', 'image/png', 'image/gif', 'image/jpg'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Invalid file type');
    }
    try {
      const name = await this.uploadToAwsProvider.fileUpload(file);
      const uploadFile: UploadFile = {
        name,
        path: `${this.configService.get('appConfig.awsCloudFrontUrl')}/${name}`,
        type: fileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };
      const upload = this.uploadRepository.create(uploadFile);
      await this.uploadRepository.save(upload);
      return uploadFile; // Return the UploadFile object
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
