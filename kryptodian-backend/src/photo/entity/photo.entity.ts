import { Profile } from "../../profile/entities/profile.entity";
import { Column, Entity, OneToOne, PrimaryColumn } from "typeorm";

@Entity()
export class CloudflarePhoto {
    @PrimaryColumn('uuid')
    imageId: string

    @Column()
    imageHash: string

    @Column()
    imageVariant: string

    @OneToOne((type) => Profile, (profile) => profile.photo)
    profile: Profile
}