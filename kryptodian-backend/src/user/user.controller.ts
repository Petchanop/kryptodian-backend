import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';
import * as slugid from 'slugid';
import { Roles } from 'src/profile/decorators/public.decorator';
import { UserRole } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';

const createUserResponse = (user: ResponseUserDto) => {
  const res = {
    id: slugid.encode(user.id),
    username: user.username,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  return res;
};

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiCreatedResponse({
    description: 'create user',
    type: ResponseUserDto,
  })
  @ApiBearerAuth('JWT')
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const res = this.userService.create(createUserDto);
    return res;
  }
  
  @Get()
  @UseGuards(AuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'get all users',
    type: ResponseUserDto,
  })
  @ApiBearerAuth('JWT')
  async findAll(): Promise<ResponseUserDto[]> {
    const users = this.userService.findAll();
    const res: ResponseUserDto[] = (await users).map((user) => {
      return createUserResponse(user);
    });
    return res;
  }

  @Get(':id')
  // @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'get user by user id',
    type: ResponseUserDto,
  })
  @ApiBearerAuth('JWT')
  async getUserById(@Param('id') id: string): Promise<ResponseUserDto> {
    const slugId = slugid.decode(id);
    const user = await this.userService.getUserById(slugId);
    const res = createUserResponse(user);
    return res;
  }

  @Get('/username/:username')
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'get user by user name',
    type: ResponseUserDto,
  })
  @ApiBearerAuth('JWT')
  async getUserByUserName(
    @Param('username') username: string,
  ): Promise<ResponseUserDto> | null {
    const user = await this.userService.getUserByUserName(username);
    const res = createUserResponse(user);
    return res;
  }

  @Patch(':id')
  @ApiCreatedResponse({
    description: 'update user by user id',
    type: ResponseUserDto,
  })
  @ApiBearerAuth('JWT')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const slugId = slugid.decode(id);
    const user = await this.userService.update(slugId, updateUserDto);
    const res = createUserResponse(user);
    return res;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT')
  remove(@Param('id') id: string) {
    const slugId = slugid.decode(id);
    return this.userService.remove(slugId);
  }
}
