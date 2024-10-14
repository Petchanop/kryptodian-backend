import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { Portfolio } from './entities/portfolio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { User } from '../user/entities/user.entity';
import { createPortfolioDto, portFolioDto } from './dto/portfolio.dto';
import * as slugid from 'slugid';

export type Ttoken = {
    token: string;
    symbol: string;
    name: string;
    logo: string;
    balance: string;
}

@Injectable()
export class PortfolioService {
    constructor(
        @InjectRepository(Portfolio)
        public portfolioRepository: Repository<Portfolio>,
        private dataSource: DataSource,
        private readonly httpService: HttpService
    ) { }

    async createPortfolio(user: User, payload: createPortfolioDto): Promise<boolean> {
        const profile = await this.dataSource.getRepository(Profile).findOne({
            relations: {
                user: true
            },
            where: { user: { id: slugid.decode(user.id) } }
        });
        console.log("create port", user, profile, payload);
        if (!profile) {
            throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
        }
        const portfolio = new Portfolio({
            network: payload.network,
            wallet: payload.wallet,
            profile: profile,
        })
        const getPort = await this.portfolioRepository.find({
            relations: {
                profile: true
            },
            where: {
                profile: { id: profile.id }
            }
        })
        const updateUserPortfolio = []
        updateUserPortfolio.push(portfolio)
        updateUserPortfolio.push(...getPort)
        profile.portfolio = updateUserPortfolio;
        console.log("create portfolio ", updateUserPortfolio)
        try {
            await this.portfolioRepository.save(updateUserPortfolio);
        } catch (error) {
            throw new HttpException("Cannot create portfolio.", HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return true;
    }

    async addPortfolio(user: User, payload: createPortfolioDto): Promise<boolean> {
        console.log("add port", user.id);
        const profile = await this.dataSource.getRepository(Profile).findOne({
            relations: {
                portfolio: true
            },
            where: { user: { id: slugid.decode(user.id) } }
        });
        if (!profile) {
            throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
        }
        const portfolio = this.portfolioRepository.create({
            network: payload.network,
            wallet: payload.wallet,
            profile: profile
        })
        profile.portfolio.push(portfolio)
        try {
            await this.dataSource.getRepository(Profile).save(profile)
            await this.portfolioRepository.save(portfolio);
        } catch (error) {
            throw new HttpException('Can not add portfolio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return true;
    }

    async updatePortfolio(portfolioId: string, payload: createPortfolioDto): Promise<boolean> {
        const portfolio = await this.portfolioRepository.findOne({ where: { id: portfolioId } });
        if (!portfolio) {
            throw new HttpException("Portfolio not found.", HttpStatus.NOT_FOUND);
        }
        for (let attribute in payload) {
            if (portfolio[attribute]) {
                portfolio[attribute] = payload[attribute];
            }
        }
        this.portfolioRepository.save(portfolio)
        return true;
    }

    async deletePortfolio(portfolioId: string): Promise<boolean> {
        const portfolio = await this.portfolioRepository.findOne({ where: { id: portfolioId } })
        try {
            await this.portfolioRepository.remove(portfolio);
        } catch (error) {
            throw new HttpException('Can not delete portfolio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return true;
    }

    async getAllPortfolio(userId: string): Promise<portFolioDto[]> {
        const profile = await this.dataSource.getRepository(Profile).findOne({ where: { user: { id: userId } } });
        const portfolio = await this.portfolioRepository.find({ where: { profile: { id: profile.id } } });
        console.log(portfolio);
        return portfolio.map((port) => {
            return {
                id: slugid.encode(port.id),
                network: port.network,
                wallet: port.wallet,
            }
        });
    }

    async getPortfolio(portfolioId: string): Promise<portFolioDto> {
        const port = await this.portfolioRepository.findOne({ where: { id: portfolioId } });
        return {
            id: slugid.encode(port.id),
            network: port.network,
            wallet: port.wallet,
        };
    }

    async getWalletToken(portFolioId: string): Promise<Observable<AxiosResponse<Ttoken[]>>> {
        const port = await this.portfolioRepository.findOne({ where: { id: portFolioId } });
        console.log("portFolio", port, `${process.env.MORALIS_API}${port.wallet}/erc20?chain=${port.network}`);
        // const data = this.httpService.get('https://deep-index.moralis.io/api/v2.2/0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326/erc20?chain=eth', {
        const data = this.httpService.get(`${process.env.MORALIS_API}/${port.wallet}/erc20?chain=${port.network}`, {
            headers: {
                "X-API-Key": `${process.env.MORALIS_API_KEY}`,
                "accept": "application/json"
            }
        });
        return data.pipe(map((axiosResponse: AxiosResponse) => {
            return axiosResponse.data.map((data) => {
                return {
                    token: data.token_address,
                    symbol: data.symbol,
                    name: data.name,
                    logo: data.logo,
                    balance: data.balance
                }
            });
        }))
    }
}
