import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  public findAll(limit: number, page: number) {
    const isAuthenticated = this.authService.isAuthenticated('sample-token');
    console.log('Is authenticated:', isAuthenticated);
    return [
      { firstName: 'John', email: 'john.doe@example.com' },
      { firstName: 'Jane', email: 'jane.doe@example.com' },
    ];
  }

  public findById(id: string) {
    return { id: 1234, firstName: 'John', email: 'john.doe@example.com' };
  }
  public createUser(user: CreateUserDto) {
    console.log('Creating user:', user);
    return { id: 1, ...user };
  }
}
