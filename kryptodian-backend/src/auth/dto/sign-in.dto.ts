import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";
import { passwordRegEx } from "src/user/dto/constants";
import internal from "stream";

export class SigninDto {
    // @MinLength(3, { message: 'Username must have atleast 3 characters.' })
    // @IsAlphanumeric(null, {
    //     message: 'Username does not allow other than alpha numeric chars.',
    // })
    @ApiProperty()
    username: string;

    @IsEmail( undefined, { message: 'Please provide valid Email.' })
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @Matches(passwordRegEx, {
        message: `Password must contain Minimum 8 and maximum 20 characters, 
      at least one uppercase letter, 
      one lowercase letter, 
      one number and 
      one special character`,
    })
    @ApiProperty()
    password: string;
}

export class SignOutDto {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  detail: string;
}