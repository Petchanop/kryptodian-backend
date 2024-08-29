import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const res = this.userService.create(createUserDto);
        return res;
    }

    async signIn(payload: CreateUserDto): Promise<any> {
        var user: User;
        if (payload.username) {
            user = await this.userService.getUserByUserName(payload.username);
        } else if (payload.email) {
            user = await this.userService.getUserByEmail(payload.email);
        }
        const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
        if (!isPasswordMatch) {
            throw new UnauthorizedException;
        }
        return {
            access_token: await this.jwtService.signAsync(user),
        };
    }

}
