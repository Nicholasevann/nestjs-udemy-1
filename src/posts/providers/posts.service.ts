import { Injectable } from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
  ) {}

  public async findAll() {
    const post = await this.postRepository.find({
      // can use eager or manual
      relations: {
        metaOptions: true,
        author: true,
        tags: true,
      },
    });
    return post;
  }
  public async findAllByUser(userId: string) {
    // const user = this.userService.findById(userId);
    const post = await this.postRepository.find({
      // can use eager or manual
      relations: {
        metaOptions: true,
        author: true,
      },
    });
    return post;
    // if (!user) {
    //   return [];
    // }
    // return [
    //   { title: `Post by ${user.id}`, content: 'Content of post by user' },
    // ];
  }
  public async createPost(createPostDto: CreatePostDto) {
    // find author from db
    const author = await this.userService.findById(createPostDto.authorId);
    const tags = await this.tagsService.findMultipleTags(
      createPostDto?.tags ?? [],
    );

    if (!author) {
      throw new Error('Author not found');
    }
    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });
    return await this.postRepository.save(post);
    // return {
    //   data: this.postRepository.create(createPostDto),
    //   message: 'Post created successfully',
    // };
  }
  public patchPost(patchPostDto: PatchPostDto) {
    // Logic to create a post can be added here
    return { data: patchPostDto, message: 'Post updated successfully' };
  }

  public async delete(id: number) {
    // // find post
    // const post = await this.postRepository.findOneBy({ id });
    // // delete post
    await this.postRepository.delete(id);
    // // delete meta options
    // await this.metaOptionsRepository.delete(post?.metaOptions?.id ?? 0);
    // // confirmation
    // const inversePost = await this.metaOptionsRepository.find({
    //   where: { id: post?.metaOptions?.id },
    //   relations: {
    //     post: true,
    //   },
    // });
    return { deleted: true, id };
  }
}
