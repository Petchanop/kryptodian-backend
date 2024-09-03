import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';
import { Portfolio } from './entities/portfolio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Profile } from 'src/profile/entities/profile.entity';
import { User } from 'src/user/entities/user.entity';
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
        console.log("create port", user, payload);
        const profile = await this.dataSource.getRepository(Profile).findOne({ where: { user: { id: user.id } } });
        const portfolio = new Portfolio({
            network: payload.network,
            wallet: payload.wallet,
            profile: profile,
        })
        console.log(profile, portfolio);
        profile.portfolio = [portfolio];
        try {
            await this.dataSource.manager.save(profile);
            await this.portfolioRepository.save(portfolio);
        } catch (error) {

        }
        return true;
    }

    async addPortfolio(user: User, payload: createPortfolioDto): Promise<boolean> {
        const profile = await this.dataSource.getRepository(Profile).findOne({ where: { user: { id: user.id } } });
        const portfolio = new Portfolio({
            network: payload.network,
            wallet: payload.wallet,
            profile: profile,
        })
        try {
            await this.dataSource.manager.save(profile);
            await this.portfolioRepository.save(portfolio);
        } catch (error) {
            throw new HttpException('Can not add portfolio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return true;
    }

    async deletePortfolio(user: User, portfolioId: string): Promise<boolean> {
        const profile = await this.dataSource.getRepository(Profile).findOne({ where: { user: { id: user.id } } });
        const portfolio = await this.portfolioRepository.findOne({ where: { id: portfolioId } })
        try {
            await this.dataSource.manager.save(profile.portfolio.filter((port) => port.id != portfolioId));
            await this.portfolioRepository.delete(portfolio);
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

    async getWalletToken(payload: Portfolio): Promise<Observable<AxiosResponse<Ttoken[]>>> {
        console.log("token", payload, `${process.env.MORALIS_API}/${payload.wallet}/erc20?chain=${payload.network}`);
        // const data = this.httpService.get('https://deep-index.moralis.io/api/v2.2/0x1f9090aaE28b8a3dCeaDf281B0F12828e676c326/erc20?chain=eth', {
        const data = this.httpService.get(`${process.env.MORALIS_API}/${payload.wallet}/erc20?chain=${payload.network}`, {
            headers: {
                "X-API-Key": `${process.env.MORALIS_API_KEY}`,
                "accept": "application/json"
            }
        });
        const res = data.pipe(map((axiosResponse: AxiosResponse) => {
            console.log("axios", axiosResponse.data);
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
        console.log(res)
        return res;
    }
}
