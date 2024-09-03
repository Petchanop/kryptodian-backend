import { ApiProperty } from "@nestjs/swagger";

export class createPortfolioDto {
    @ApiProperty()
    network: string;

    @ApiProperty()
    wallet: string;
}

export class portFolioDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    network: string;

    @ApiProperty()
    wallet: string;
}