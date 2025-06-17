import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HasingProvider } from './hasing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly hasingProvider: HasingProvider, // Assuming you have a HasingProvider for password hashing

    private readonly jwtService: JwtService, // Injecting JwtService for token generation
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  public async signIn(signInDto: SignInDto) {
    console.log(signInDto);
    const user = await this.userService.findOneByEmail(signInDto.email);
    let isEqual: boolean = false;
    try {
      isEqual = await this.hasingProvider.comparePassword(
        signInDto.password,
        user!.password,
      );
      console.log(isEqual);
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Error comparing passwords',
      });
    }
    if (!isEqual) {
      throw new RequestTimeoutException('Invalid credentials', {
        description: 'The email or password is incorrect',
      });
    }
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user!.id,
        email: user!.email,
      },
      {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
    return {
      accessToken,
    };
  }
}
