import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  public findAll() {
    return [
      { title: 'Post 1', content: 'Content of post 1' },
      { title: 'Post 2', content: 'Content of post 2' },
    ];
  }
  public findAllByUser(userId: string) {
    const user = this.userService.findById(userId);
    if (!user) {
      return [];
    }
    return [
      { title: `Post by ${user.id}`, content: 'Content of post by user' },
    ];
  }
  public createPost(createPostDto: CreatePostDto) {
    // Logic to create a post can be added here
    return { data: createPostDto, message: 'Post created successfully' };
  }
  public patchPost(patchPostDto: PatchPostDto) {
    // Logic to create a post can be added here
    return { data: patchPostDto, message: 'Post updated successfully' };
  }
}
