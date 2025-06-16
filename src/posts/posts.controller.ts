/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public getAllPosts(@Query() postQuery: GetPostsDto) {
    return this.postsService.findAll(postQuery);
  }

  @Get(':userId')
  public getPostsByUser(
    @Param('userId') userId: string,
    @Query() postQuery: GetPostsDto,
  ) {
    console.log('User ID:', userId);
    console.log(postQuery);
    return this.postsService.findAllByUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDto) {
    return this.postsService.patchPost(patchPostDto);
  }
  @Delete()
  public deletePost(@Query('id', ParseIntPipe) id: number) {
    return this.postsService.delete(id);
  }
}
