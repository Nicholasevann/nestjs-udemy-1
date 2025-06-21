import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshToken } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/users/providers/users.service';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class RefreshTokensProvider {
  constructor(
    private readonly jwtService: JwtService, // Injecting JwtService for token generation
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}
  public async refreshToken(
    refreshTokenDto: RefreshToken,
  ): Promise<{ sub: number }> {
    try {
      const { sub } = await this.jwtService.verifyAsync<{ sub: number }>(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );
      // Use the 'sub' value, for example, return it
      const user = await this.userService.findById(sub);
      const tokens = await this.generateTokensProvider.generateTokens(user);
      return { ...tokens, sub: user.id };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token', {
        description: 'The provided refresh token is invalid or expired.',
      });
    }
  }
}
