import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    public userRepository: Repository<User>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt());
    return hashPassword;
  }
  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user: User = new User({
      username: createUserDto.username,
      email: createUserDto.email,
      password: await this.hashPassword(createUserDto.password),
    });
    const res = this.userRepository.save(user);
    return res;
  }

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async getUserByUserName(username: string): Promise<ResponseUserDto> | null {
    return this.userRepository.findOneBy({ username });
  }

  async getUserById(id: string): Promise<ResponseUserDto> | null {
    return this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<ResponseUserDto> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    const user: User = await this.userRepository.findOne({ where: { id } });
    console.log(updateUserDto);
    const updated = Object.assign(user, updateUserDto);
    return this.userRepository.save(updated);
  }

  async remove(id: string): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}
