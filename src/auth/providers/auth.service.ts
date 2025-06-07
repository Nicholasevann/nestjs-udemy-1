import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  public login(email: string, password: string, id: string): string {
    // Simulate a login process
    const user = this.userService.findById(id);
    return 'sample token';
  }
  public isAuthenticated(token: string): boolean {
    // Simulate token validation
    return true;
  }
}
