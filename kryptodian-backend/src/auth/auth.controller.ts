import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseUserDto } from '../user/dto/response-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from './decorators/public.decorator';
import { SigninDto, SignOutDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { throwIfEmpty } from 'rxjs';

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

    @Public()
    @Post('/signin')
    @ApiCreatedResponse({
        description: 'user sign in',
        type: AuthResponseDto,
    })
    async signIn(@Body() payload: SigninDto): Promise<AuthResponseDto> {
        const res = await this.authService.signIn(payload);
        return res;
    }

    @Post('/signout')
    @ApiCreatedResponse({
        description: 'user sign in',
        type: AuthResponseDto,
    })
    @ApiBearerAuth('JWT')
    async singOut(@Req() req): Promise<AuthResponseDto> {
        const res = await this.authService.signOut(req.user);
        return res;
    }
}
