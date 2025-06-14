/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';

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
  ) {}
  /**
   * Find all users with pagination.
   * @param limit Number of users per page.
   * @param page Page number.
   * @returns List of users.
   */
  public findAll(limit: number, page: number) {
    const isAuthenticated = this.authService.isAuthenticated('sample-token');
    const environment = this.configService.get('S3_BUCKET');
    console.log(environment);
    return [
      { firstName: 'John', email: 'john.doe@example.com' },
      { firstName: 'Jane', email: 'jane.doe@example.com' },
    ];
  }

  /**
   * Find a user by ID.
   * @param id User ID.
   * @returns User object.
   */
  public async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  /**
   * Create a new user.
   * @param user User data.
   * @returns Created user object.
   */
  public async createUser(user: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    let newUser = this.userRepository.create(user);
    newUser = await this.userRepository.save(newUser);
    return newUser;
  }
}
