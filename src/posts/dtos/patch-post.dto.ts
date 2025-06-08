import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

// partial type to make not mandatory body
export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The Id is required',
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
