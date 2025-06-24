import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HasingProvider } from 'src/auth/providers/hasing.provider';
import { MailService } from 'src/mail/providers/mail.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => HasingProvider))
    private readonly hashingProvider: HasingProvider,
    private readonly mailService: MailService,
  ) {}
  public async createUser(user: CreateUserDto) {
    let existingUser: User | null = null;
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('Unable to process your request', {
        description: 'Error connecting to the database',
      });
    }

    if (existingUser) {
      throw new BadRequestException('The user already exists');
    }

    let newUser = this.userRepository.create({
      ...user,
      password: await this.hashingProvider.hashPassword(user.password),
    });
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException('Unable to process your request', {
        description: 'Error connecting to the database',
      });
    }
    try {
      await this.mailService.sendUserWelcome(newUser);
    } catch (error) {
      throw new RequestTimeoutException(error);
    }
    return newUser;
  }
}
