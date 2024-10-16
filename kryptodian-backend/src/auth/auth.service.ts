import { HttpException, HttpStatus, Injectable, Scope } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { SigninDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';
import * as slugid from 'slugid';

@Injectable({ scope: Scope.REQUEST})
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }

    async register(createUserDto: CreateUserDto): Promise<User> {
        const res = this.userService.create(createUserDto);
        return res;
    }

    async signIn(payload: SigninDto): Promise<AuthResponseDto> {
        var user: User;
        if (payload.username) {
            user = await this.userService.getUserByUserName(payload.username);
        } else if (payload.email) {
            user = await this.userService.getUserByEmail(payload.email);
        } else {
            throw new HttpException('Please fill in Username or Email.', HttpStatus.BAD_REQUEST);
        }
        await this.userService.verifyPassword(payload.password, user.password);
        // this.userService.setLogin(user.id, true);
        const generateAccessToken = {
            id: slugid.encode(user.id),
            username: user.username,
            email: user.email,
            role: user.role,
            timeout: process.env.EXPIRESIN,
        };
        console.log("sigIn success")
        return {
            id: slugid.encode(user.id),
            username: user.username,
            email: user.email,
            role: user.role,
            accessToken: await this.jwtService.signAsync(generateAccessToken, {
                secret: `${process.env.SECRETKEY}`,
                expiresIn: `${process.env.EXPIRESIN}`,
            }),
            timeout: process.env.EXPIRESIN,
        };
    }

    async signOut(user: User): Promise<AuthResponseDto> {
        console.log(user.id);
        // this.userService.setLogin(slugid.decode(user.id), false);
        return {
            id: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
            accessToken: "",
            timeout: "0",
        }
    }
}
