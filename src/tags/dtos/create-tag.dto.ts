import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  MaxLength,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @MaxLength(256)
  name: string;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase and can only contain letters, numbers, and hyphens',
  })
  @MaxLength(512)
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  schema?: string;

  @IsString()
  @IsOptional()
  @MaxLength(1024)
  featureImageUrl?: string;
}
