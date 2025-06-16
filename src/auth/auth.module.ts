import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HasingProvider } from './providers/hasing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sing-in-provider';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: HasingProvider, useClass: BcryptProvider },
    SignInProvider,
  ],
  imports: [forwardRef(() => UsersModule)], // Import other modules if needed
  exports: [AuthService, HasingProvider], // Exporting AuthService to be used in other modules if needed
})
export class AuthModule {}
