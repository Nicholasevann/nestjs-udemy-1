/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';

import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import profileConfig from '../config/profile.config';
import { error } from 'console';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUserDto } from '../dtos/create-many-user.dto';
import { CreateUserProvider } from './create-user.provider.ts';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { FindOneByGoogleProvider } from './find-one-by-google.provider';

/**
 * Service for managing users.
 */
@Injectable()
export class UsersService {
  /**
   * Constructor for UsersService.
   * @param authService AuthService instance for authentication checks.
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
    private readonly dataSource: DataSource,
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
    private readonly createUserProvider: CreateUserProvider,
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
    private readonly findOneByGoogleProvider: FindOneByGoogleProvider, // This is a circular dependency, so we use forwardRef
  ) {}
  /**
   * Find all users with pagination.
   * @param limit Number of users per page.
   * @param page Page number.
   * @returns List of users.
   */
  public findAll(limit: number, page: number) {
    return this.userRepository.find();
  }

  /**
   * Find a user by ID.
   * @param id User ID.
   * @returns User object.
   */
  public async findById(id: number) {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('Unable to process your request', {
        description: 'Error connecting to the database',
      });
    }
    if (!user) {
      throw new BadRequestException('The user is undefined');
    }
    return user;
  }

  /**
   * Create a new user.
   * @param user User data.
   * @returns Created user object.
   */
  public async createUser(user: CreateUserDto) {
    return await this.createUserProvider.createUser(user);
  }

  public async createMany(createManyUserDto: CreateManyUserDto) {
    return await this.usersCreateManyProvider.createMany(createManyUserDto);
  }
  public async findOneByEmail(email: string): Promise<User | null> {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }
  public async findOneByGoogleId(googleId: string): Promise<User | null> {
    return await this.findOneByGoogleProvider.findOneByGoogleId(googleId);
  }
}
