import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('/register')
    @ApiCreatedResponse({
        description: 'register user',
        type: ResponseUserDto,
    })
    async register(@Body() createUser: CreateUserDto): Promise<ResponseUserDto> {
        const res = await this.authService.register(createUser);
        return res;
    }

    @Post('/signin')
    @ApiCreatedResponse({
        description: 'user sign in',
    })
    async signIn(@Body() createUser: CreateUserDto): Promise<{ accessToken: string }> {
        const res = await this.authService.signIn(createUser);
        return res;
    }
}
