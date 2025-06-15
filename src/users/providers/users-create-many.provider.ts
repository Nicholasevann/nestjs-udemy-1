/* eslint-disable no-unsafe-finally */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { DataSource } from 'typeorm';
import { CreateManyUserDto } from '../dtos/create-many-user.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(private readonly dataSource: DataSource) {}

  public async createMany(createManyUserDto: CreateManyUserDto) {
    const newUsers: User[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    const userRepository = this.dataSource.getRepository(User);
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Unable to process your request', {
        description: 'Error connecting to the database',
      });
    }
    try {
      for (const user of createManyUserDto.users) {
        let existingUser: User | null = null;
        try {
          existingUser = await userRepository.findOne({
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
        // Optionally, skip or handle existing users here if needed
        const newUser = queryRunner.manager.create(User, user);
        const result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Couldnt complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        throw new ConflictException('Couldnt complete the transaction', {
          description: String(error),
        });
      }
    }
    return newUsers;
  }
}
