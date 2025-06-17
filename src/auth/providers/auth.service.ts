import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in-provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly signInProvider: SignInProvider,
  ) {}
  public login(email: string, password: string, id: string): string {
    // Simulate a login process
    // const user = this.userService.findById(id);
    return 'sample token';
  }
  public signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }
  public isAuthenticated(token: string): boolean {
    // Simulate token validation
    return true;
  }
}
