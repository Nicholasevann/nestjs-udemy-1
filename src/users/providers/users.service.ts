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
  ) {}
  /**
   * Find all users with pagination.
   * @param limit Number of users per page.
   * @param page Page number.
   * @returns List of users.
   */
  public findAll(limit: number, page: number) {
    throw new HttpException(
      {
        status: HttpStatus.MOVED_PERMANENTLY,
        error: 'The API doesnt exist',
        fileName: 'user.service.ts',
        lineNumber: 88,
      },
      400,
    );
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
    let existingUser: User | null = null;
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('Unable to process your request', {
        description: 'Error connecting to the database',
      });
    }

    if (existingUser) {
      throw new BadRequestException('The user already exists');
    }

    let newUser = this.userRepository.create(user);
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException('Unable to process your request', {
        description: 'Error connecting to the database',
      });
    }

    return newUser;
  }

  public async createMany(createManyUserDto: CreateManyUserDto) {
    return await this.usersCreateManyProvider.createMany(createManyUserDto);
  }
}
