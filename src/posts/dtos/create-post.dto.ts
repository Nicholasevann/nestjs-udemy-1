import {
  IsString,
  IsEnum,
  MinLength,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsJSON,
  IsISO8601,
  IsArray,
  ValidateNested,
  isInt,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostMetaOptionsDto } from 'src/meta-options/dtos/create-post-meta-options..dto';

export enum PostTypeEnum {
  ARTICLE = 'ARTICLE',
  NEWS = 'NEWS',
  TUTORIAL = 'TUTORIAL',
  // add more as needed
}

export enum StatusEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  // add more as needed
}

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post',
    example: 'Understanding NestJS',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Type of the post',
    enum: PostTypeEnum,
    example: PostTypeEnum.ARTICLE,
  })
  @IsEnum(PostTypeEnum)
  @IsNotEmpty()
  postType: PostTypeEnum;

  @ApiProperty({
    description: 'Unique slug for the post',
    example: 'understanding-nestjs',
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase and can only contain letters, numbers, and hyphens',
  })
  slug: string;

  @ApiProperty({
    description: 'Status of the post',
    enum: StatusEnum,
    example: StatusEnum.DRAFT,
  })
  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @ApiPropertyOptional({
    description: 'Content of the post',
    example: 'This is the content of the post.',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Schema of the post (JSON string)',
    example: '{"type":"blog"}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Featured image URL',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Publish date (ISO 8601 format)',
    example: '2024-06-01T12:00:00Z',
  })
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Tags for the post',
    example: ['nestjs', 'backend', 'typescript'],
  })
  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    description: 'Meta options for the post',
    type: CreatePostMetaOptionsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;
}
