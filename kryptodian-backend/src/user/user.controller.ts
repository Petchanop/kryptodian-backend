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
  UseInterceptors,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseUserDto } from './dto/response-user.dto';
import * as slugid from 'slugid';
import { Roles } from '../profile/decorators/public.decorator';
import { UserRole } from './entities/user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { SlugIdPipe } from '../slugId.pipe';
import { SlugIdInterceptor } from '../slugId.interceptor';
import { PaginationDto } from '../dto/pagination/pagination.dto';

const createUserResponse = (user: ResponseUserDto) => {
  const res = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
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
  @UseInterceptors(SlugIdInterceptor)
  @ApiBearerAuth('JWT')
  async findAll(@Query() query: PaginationDto): Promise<ResponseUserDto[]> {
  // async findAll(@Req() req): Promise<ResponseUserDto[]> {
    console.log("query", query)
    const users = this.userService.findAll(query);
    const res: ResponseUserDto[] = (await users).map((user) => {
      return createUserResponse(user);
    });
    return res;
  }

  @Get(':id')
  @ApiCreatedResponse({
    description: 'get user by user id',
    type: ResponseUserDto,
  })
  @UseInterceptors(SlugIdInterceptor)
  @ApiBearerAuth('JWT')
  async getUserById(@Param('id', SlugIdPipe) id: string): Promise<ResponseUserDto> {
    const user = await this.userService.getUserById(id);
    const res = createUserResponse(user);
    return res;
  }

  @Get('/username/:username')
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'get user by user name',
    type: ResponseUserDto,
  })
  @UseInterceptors(SlugIdInterceptor)
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
  @UseInterceptors(SlugIdInterceptor)
  @ApiBearerAuth('JWT')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    const res = createUserResponse(user);
    return res;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT')
  remove(@Param('id', SlugIdPipe) id: string) {
    return this.userService.remove(id);
  }
}
