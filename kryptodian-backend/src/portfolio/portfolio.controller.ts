import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { PortfolioService, Ttoken } from './portfolio.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import * as slugid from 'slugid';
import { createPortfolioDto, portFolioDto } from './dto/portfolio.dto';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { SlugIdPipe } from '../slugId.pipe';

@ApiTags('Portfolio')
@Controller('portfolio')
@ApiBearerAuth('JWT')
export class PortfolioController {
    constructor(private readonly portfolioService: PortfolioService) { }

    @Post('/')
    @ApiCreatedResponse({
        description: 'create portfolio by adding network and wallet address',
        type: Response
    })
    async createPortfolio(@Req() req, @Body() payload: createPortfolioDto, @Res() res: Response): Promise<Response> {
        try {
            const result = await this.portfolioService.createPortfolio(req.user, payload);
            console.log("portfolio", result);
            return res.status(HttpStatus.CREATED).send();
        } catch (error) {
            throw new HttpException('Can not create portfolio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Patch('/')
    @ApiCreatedResponse({
        description: 'add portfolio to profile',
        type: Response
    })
    async addPortfolio(@Req() req, @Body() payload: createPortfolioDto, @Res() res: Response): Promise<Response> {
        const result = await this.portfolioService.addPortfolio(req.user, payload);
        return res.status(HttpStatus.CREATED).send();
    }

    @Patch("/:id")
    @ApiCreatedResponse({
        description: 'update portfolio by id as a param',
        type: Response
    })
    async updatePortfolio(@Param('id', SlugIdPipe) id: string, @Body() payload: createPortfolioDto, @Res() res:Response): Promise<Response>{
        await this.portfolioService.updatePortfolio(id, payload);
        return res.status(HttpStatus.ACCEPTED).send();
    }

    @Delete('/:id')
    @ApiCreatedResponse({
        description: 'delete portfolio to profile',
        type: Response
    })
    async deletePortfolio(@Req() req, @Param('id', SlugIdPipe) portfolioId: string, @Res() res: Response): Promise<Response> {

        const result = await this.portfolioService.deletePortfolio(portfolioId);
        return res.status(HttpStatus.NO_CONTENT).send();
    }

    @Get('/')
    @ApiCreatedResponse({
        description: 'get all user portfolios',
        type: portFolioDto,
    })
    async getAllPortfolio(@Req() req): Promise<portFolioDto[]> {
        console.log("get all ", req.user.id);
        const result = await this.portfolioService.getAllPortfolio(slugid.decode(req.user.id));
        return result;
    }

    @Get('/:id')
    @ApiCreatedResponse({
        description: 'get user portfolio by portfolio id',
        type: portFolioDto,
    })
    async getPortFolioById(@Param('id', SlugIdPipe) id: string): Promise<portFolioDto> {
        const result = await this.portfolioService.getPortfolio(id);
        return result;
    }

    @Get('/details/:id')
    @ApiCreatedResponse({
        description: 'get token by Wallet address',
    })
    async getPortfolioDetails(@Param('id', SlugIdPipe) id: string): Promise<Observable<AxiosResponse<Ttoken[]>>> {
        const response = await this.portfolioService.getWalletToken(id);
        return response;
    }
}
