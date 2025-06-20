import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from 'src/posts/dtos/create-post.dto';
import { UsersService } from 'src/users/providers/users.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { ActiveUserInterface } from 'src/auth/interfaces/active-user.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async findAll(postQuery: GetPostsDto): Promise<Paginated<Post>> {
    return this.paginationProvider.paginateQuery(
      postQuery,
      this.postRepository,
    );
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
  public async createPost(
    createPostDto: CreatePostDto,
    user: ActiveUserInterface,
  ) {
    // find author from db
    let author;
    let tags;
    try {
      author = await this.userService.findById(user.sub);
      tags = await this.tagsService.findMultipleTags(createPostDto?.tags ?? []);
    } catch (error) {
      throw new ConflictException(error);
    }
    if (createPostDto?.slug) {
      const existingPost = await this.postRepository.findOneBy({
        slug: createPostDto.slug,
      });
      if (existingPost) {
        throw new ConflictException('Post with this slug already exists');
      }
    }
    if (!author) {
      throw new BadRequestException('Author not found');
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
  public async patchPost(patchPostDto: PatchPostDto) {
    // find the tags
    const tags = await this.tagsService.findMultipleTags(
      patchPostDto?.tags ?? [],
    );
    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException('Please check your tag Id');
    }
    // find post
    const post = await this.postRepository.findOneBy({ id: patchPostDto.id });
    if (!post) {
      throw new BadRequestException('Post not found');
    }
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.postType = patchPostDto.postType ?? post.postType;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl = patchPostDto.featuredImageUrl
      ? patchPostDto.featuredImageUrl
      : post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn
      ? patchPostDto.publishOn
      : post.publishOn;

    post.tags = tags;
    return await this.postRepository.save(post);
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
