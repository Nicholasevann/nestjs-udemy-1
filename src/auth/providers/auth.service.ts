import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { SignInProvider } from './sign-in-provider';
import { RefreshToken } from '../dtos/refresh-token.dto';
import { RefreshTokensProvider } from './refresh-tokens.provider';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly signInProvider: SignInProvider,
    private readonly refreshTokenProvider: RefreshTokensProvider, // Assuming you have a RefreshToken provider
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
  public async refreshToken(refreshToken: RefreshToken) {
    return await this.refreshTokenProvider.refreshToken(refreshToken);
  }
}
