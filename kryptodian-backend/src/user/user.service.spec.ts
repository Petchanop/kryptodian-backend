import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';

const mockUserRepository = {
  save: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
  findAll: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  getUserByUserName: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        Repository,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new user and return its data', async () => {
    // arrange
    const createUserDto = {
      username: 'Chadwick',
      email: 'chadwickboseman@email.com',
      password: 'abcdGG124%%',
    } as CreateUserDto;

    const user = {
      username: 'Chadwick',
      email: 'chadwickboseman@email.com',
      password: 'abcdGG124%%',
    } as User;

    jest.spyOn(mockUserRepository, 'save').mockReturnValue(user);

    // act
    const result = await service.create(createUserDto);

    // assert
    expect(mockUserRepository.save).toHaveBeenCalled();

    expect(user.username).toEqual(result.username);
    expect(user.email).toEqual(result.email);

    const IsPasswordMatch = user.password === result.password;
    expect(IsPasswordMatch).toEqual(true);
  });

  it('findAll => should return a list of user', async () => {
    const user = {
      username: 'Chadwick',
      email: 'chadwickboseman@email.com',
      password: 'abcdGG124%%',
    } as User;
    const users = [user] as User[];

    jest.spyOn(mockUserRepository, 'find').mockReturnValue(users);

    await service.create(user);
    const result = await service.findAll();
    expect(mockUserRepository.find).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('getUserByUserName => use username to find user return a user or null if notfound', async () => {
    const user = {
      username: 'Chadwick',
      email: 'chadwickboseman@email.com',
      password: 'abcdGG124%%',
    } as User;

    jest.spyOn(mockUserRepository, 'findOneBy').mockReturnValue(user);
    const result = await service.getUserByUserName('Chadwick');
    expect(mockUserRepository.findOneBy).toHaveBeenCalled();
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      username: 'Chadwick',
    });
    expect(result).toEqual(user);

  });

  it('getUserByEmail => use email for search user return user or null', async () => {
    const user = {
      username: 'Chadwick',
      email: 'chadwickboseman@email.com',
      password: 'abcdGG124%%',
    } as User;

    jest.spyOn(mockUserRepository, 'findOne').mockReturnValue(user);
    const result = await service.getUserByEmail('chadwickboseman@email.com');
    expect(mockUserRepository.findOne).toHaveBeenCalled();
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { email: user.email },
    });

    expect(result).toEqual(user);
  });
});
