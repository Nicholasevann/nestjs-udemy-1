import {
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindOneUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async findOneByEmail(email: string): Promise<User | null> {
    let user: User | null = null;
    try {
      console.log('masuk');
      user = await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new RequestTimeoutException('Unable to process your request');
    }
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
