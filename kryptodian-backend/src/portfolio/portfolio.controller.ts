import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import * as slugid from 'slugid';
import { createPortfolioDto, portFolioDto } from './dto/portfolio.dto';
import { Portfolio } from './entities/portfolio.entity';

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
            const result = await this.portfolioService.createPortfolio(req, payload);
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
        const result = await this.portfolioService.addPortfolio(req, payload);
        return res.status(HttpStatus.CREATED).send();
    }

    @Delete('/:id')
    @ApiCreatedResponse({
        description: 'delete portfolio to profile',
        type: Response
    })
    async deletePortfolio(@Req() req, @Param('id') portfolioId: string, @Res() res: Response): Promise<Response> {
        const result = await this.portfolioService.deletePortfolio(req, portfolioId);
        return res.status(HttpStatus.NO_CONTENT).send();
    }

    @Get('/')
    @ApiCreatedResponse({
        description: 'get all user portfolios',
        type: portFolioDto,
    })
    async getAllPortfolio(@Req() req): Promise<portFolioDto[]> {
        console.log("get all ",req.user.id);
        const result = await this.portfolioService.getAllPortfolio(slugid.decode(req.user.id));
        return result;
    }

    @Get('/:id')
    @ApiCreatedResponse({
        description: 'get user portfolio by portfolio id',
        type: portFolioDto,
    })
    async getPortFolioById(@Param('id') id: string): Promise<portFolioDto> {
        const result = await this.portfolioService.getPortfolio(slugid.decode(id));
        return result;
    }

    @Get('/:id/details')
    @ApiCreatedResponse({
        description: 'get token by Wallet address',
    })
    async getPortfolioDetails(@Param('id') id: string, @Body() payload: Portfolio) {
        const response = await this.portfolioService.getWalletToken(payload);
        return response;
    }
}
