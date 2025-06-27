/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateGoogleUserProvider } from './create-google-user.provider';
import { FindOneByGoogleProvider } from './find-one-by-google.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';
import { CreateUserProvider } from './create-user.provider.ts';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { DataSource } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { AuthService } from 'src/auth/providers/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';

describe('UserService', () => {
  let service: UsersService;
  beforeEach(async () => {
    const mockCreateUserProvider = {
      createUser: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 12,
          firstName: createUserDto.firstName,
          lastName: createUserDto.lastName,
          email: createUserDto.email,
          password: createUserDto.password,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: CreateUserProvider, useValue: mockCreateUserProvider },
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: CreateGoogleUserProvider, useValue: {} },
        { provide: FindOneByGoogleProvider, useValue: {} },
        { provide: FindOneUserByEmailProvider, useValue: {} },
        { provide: UsersCreateManyProvider, useValue: {} },
        { provide: AuthService, useValue: {} }, // Mock AuthService
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  describe('root', () => {
    it('it should be defined', () => {
      expect(service).toBeDefined();
    });
    describe('createUser', () => {
      it('should should be defined', () => {
        expect(service.createUser).toBeDefined();
      });
      it('should call createUserProvider', async () => {
        const user = await service.createUser({
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@gmail.com',
          password: 'hashedPassword',
        });
        expect(user.firstName).toEqual('John');
      });
    });
  });
});
