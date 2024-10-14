import { IsIn, IsInt, IsString, min, Min } from "class-validator";

export class PaginationDto {
    // @IsInt()
    // @Min(1)
    page: number

    // @IsInt()
    // @Min(1)
    pageSize: number

}