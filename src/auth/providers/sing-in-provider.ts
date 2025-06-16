import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signin.dto';
import { UsersService } from 'src/users/providers/users.service';
import { HasingProvider } from './hasing.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    private readonly hasingProvider: HasingProvider, // Assuming you have a HasingProvider for password hashing
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
    return true;
  }
}
