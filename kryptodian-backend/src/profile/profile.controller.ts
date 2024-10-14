import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { ProfileService } from './profile.service';
import { Response } from 'express';
import * as slugid from 'slugid';
import { SlugIdPipe } from '../slugId.pipe';
import { SlugIdInterceptor } from '../slugId.interceptor';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post('/')
    @ApiCreatedResponse({
        description: 'create user profile',
        type: Response,
    })
    @ApiBearerAuth('JWT')
    async createProfile(@Req() req, @Body() createProfile: CreateProfileDto, @Res() res: Response): Promise<Response> {
        console.log("create Profile");
        const result = await this.profileService.createProfile(slugid.decode(req.user.id), createProfile);
        if (result) {
            return res.status(HttpStatus.CREATED).send();
        }
        return res.status(HttpStatus.BAD_GATEWAY);
    }

    @Get('/')
    @ApiCreatedResponse({
        description: 'user profile',
        type: CreateProfileDto,
    })
    @ApiBearerAuth('JWT')
    @UseInterceptors(SlugIdInterceptor)
    async getProfile(@Req() req): Promise<CreateProfileDto> {
        console.log(req.user);
        try {
            const res = await this.profileService.getProfile(slugid.decode(req.user.id));
            return res;
        } catch (error) {
            throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
        }
    }

    @Patch(':id')
    @ApiCreatedResponse({
        description: 'update user profile',
        type: Response,
    })
    @ApiBearerAuth('JWT')
    @UseInterceptors(SlugIdInterceptor)
    async updateProfile(@Param('id', SlugIdPipe) id: string, @Body() updateProfile: UpdateProfileDto, @Res() res: Response): Promise<Response> {
        const result = await this.profileService.updateProfile(id, updateProfile);
        if (result) {
            return res.status(HttpStatus.ACCEPTED).send();
        }
        return res.status(HttpStatus.BAD_GATEWAY);
    }

    @Delete(':id')
    @ApiCreatedResponse({
        description: 'delete user profile',
        type: Response,
    })
    @ApiBearerAuth('JWT')
    async deleteProfile(@Param('id', SlugIdPipe) id: string, @Res() res: Response): Promise<Response> {
        const result = await this.profileService.deleteProfile(id);
        if (result) {
            return res.status(HttpStatus.ACCEPTED).send();
        }
        return res.status(HttpStatus.BAD_GATEWAY).send();
    }
}
