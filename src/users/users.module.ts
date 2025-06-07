import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exporting UsersService to be used in other modules if needed
  imports: [forwardRef(() => AuthModule)], // You can import other modules here if needed
})
export class UsersModule {}
