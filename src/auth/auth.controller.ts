/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/signin.dto';
import { AuthType } from './enums/auth-type.enum';
import { Auth } from './decorator/auth.decorator';
import { RefreshToken } from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // Constructor logic can be added here if needed
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AuthType.None)
  refreshToken(@Body() refreshTokenDto: RefreshToken) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
