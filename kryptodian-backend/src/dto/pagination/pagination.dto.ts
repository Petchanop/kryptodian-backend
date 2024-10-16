import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsString, min, Min } from "class-validator";

export class PaginationDto {
    // @IsInt()
    // @Min(1)
    @ApiProperty()
    page: number

    // @IsInt()
    // @Min(1)
    @ApiProperty()
    pageSize: number

}