import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, MinLength } from "class-validator";

export class AuthResponseDto {
    @ApiProperty()
    id: string;

    @MinLength(3, { message: 'Username must have atleast 3 characters.' })
    @IsAlphanumeric(null, {
        message: 'Username does not allow other than alpha numeric chars.',
    })
    @ApiProperty()
    username: string;

    @IsEmail(null, { message: 'Please provide valid Email.' })
    @ApiProperty()
    email: string;

    @ApiProperty()
    role: string | null;

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    timeout: string;

    constructor(partial: Partial<AuthResponseDto>) {
        Object.assign(this, partial);
    }

}