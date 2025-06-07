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
} from 'class-validator';

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
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  title: string;

  @IsEnum(PostTypeEnum)
  @IsNotEmpty()
  postType: PostTypeEnum;

  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be lowercase and can only contain letters, numbers, and hyphens',
  })
  slug: string;

  @IsEnum(StatusEnum)
  @IsNotEmpty()
  status: StatusEnum;

  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsJSON()
  schema?: string;

  @IsString()
  @IsOptional()
  featuredImageUrl?: string;

  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @IsString()
  @IsOptional()
  metaOptions?: { [key: string]: any };
}
