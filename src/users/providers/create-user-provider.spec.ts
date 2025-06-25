/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserProvider } from './create-user.provider.ts';
import { MailService } from 'src/mail/providers/mail.service';
import { HasingProvider } from 'src/auth/providers/hasing.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { get } from 'http';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});
describe('UserService', () => {
  let provider: CreateUserProvider;
  let usersRepository: MockRepository<User>;
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    password: 'password123',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        {
          provide: MailService,
          useValue: { sendUserWelcome: jest.fn(() => Promise.resolve()) },
        },
        { provide: getRepositoryToken(User), useValue: createMockRepository() },
        {
          provide: HasingProvider,
          useValue: {
            hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
          },
        },
      ],
    }).compile();
    provider = module.get<CreateUserProvider>(CreateUserProvider);
    usersRepository = module.get(getRepositoryToken(User));
  });

  describe('root', () => {
    it('it should be defined', () => {
      expect(provider).toBeDefined();
    });
  });
});
