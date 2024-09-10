import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha } from "class-validator";

export class CreateProfileDto {
    @IsAlpha(undefined, {
        message: "Firstname must be Character Only."
    })
    @ApiProperty()
    firstName: string;

    @IsAlpha(undefined, {
        message: "Lastname must be Character Only."
    })
    @ApiProperty()
    lastName: string;
}

export class UpdateProfileDto {
    @IsAlpha(undefined, {
        message: "Firstname must be Character Only."
    })
    @ApiProperty()
    firstName: string;

    @IsAlpha(undefined, {
        message: "Lastname must be Character Only."
    })
    @ApiProperty()
    lastName: string;
}

export class getProfileDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @IsAlpha(undefined, {
        message: "Lastname must be Character Only."
    })
    @ApiProperty()
    lastName: string;
}