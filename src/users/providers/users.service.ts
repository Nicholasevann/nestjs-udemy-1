import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';

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
  ) {}

  /**
   * Find all users with pagination.
   * @param limit Number of users per page.
   * @param page Page number.
   * @returns List of users.
   */
  public findAll(limit: number, page: number) {
    const isAuthenticated = this.authService.isAuthenticated('sample-token');
    console.log('Is authenticated:', isAuthenticated);
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
  public findById(id: string) {
    return { id: 1234, firstName: 'John', email: 'john.doe@example.com' };
  }

  /**
   * Create a new user.
   * @param user User data.
   * @returns Created user object.
   */
  public createUser(user: CreateUserDto) {
    console.log('Creating user:', user);
    return { id: 1, ...user };
  }
}
