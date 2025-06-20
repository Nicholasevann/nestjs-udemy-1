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
  Req,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatchPostDto } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { REQUEST } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';

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
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserInterface,
  ) {
    return this.postsService.createPost(createPostDto, user);
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
