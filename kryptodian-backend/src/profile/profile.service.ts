import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import { User } from 'src/user/entities/user.entity';
import { create } from 'domain';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        public profileRepository: Repository<Profile>,
        private dataSource: DataSource,
    ) { }

    async createProfile(userId: string, createProfile: CreateProfileDto): Promise<CreateProfileDto> {
        const user = await this.dataSource.getRepository(User).findOne({ where: { id: userId } });
        const profile: Profile = new Profile({
            firstName: createProfile.firstName,
            lastName: createProfile.lastName,
            user: user,
        })
        const res = this.dataSource.manager.save(profile);
        return res;
    }

    async getProfile(id: string): Promise<CreateProfileDto> {
        const profile = await this.profileRepository.findOne({
            relations: { user: true },
            where: { user: { id } }
        });
        return profile;
    }

    async updateProfile(
        id: string,
        updateProfile: UpdateProfileDto
    ): Promise<UpdateProfileDto> {
        const profile: Profile = await this.profileRepository.findOne({ where: { id } });
        if (!profile)
            throw new HttpException('Profile not Found', HttpStatus.NOT_FOUND);
        const updated = Object.assign(profile, updateProfile);
        return this.profileRepository.save(updated);
    }

    async deleteProfile(id: string): Promise<{ affected?: number }> {
        return this.profileRepository.delete(id);
    }
}
