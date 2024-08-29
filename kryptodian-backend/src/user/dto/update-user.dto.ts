import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Matches } from 'class-validator';
import { passwordRegEx } from './constants';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEmail(null, { message: 'Please provide valid Email.' })
  @ApiProperty()
  email: string;

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
