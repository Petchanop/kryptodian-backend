import { CloudflarePhoto } from "../../photo/entity/photo.entity";
import { Portfolio } from "../../portfolio/entities/portfolio.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne((type) => User, (user) => user.profile, {
        cascade : ["update", "insert"]
    })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user: User

    @OneToOne((type) => CloudflarePhoto, (photo) => photo.profile)
    photo: CloudflarePhoto

    @OneToMany(() => Portfolio, (portfolio) => portfolio.profile, {
        cascade : ["update", "insert"]
    })
    portfolio: Portfolio[];

    constructor(partial: Partial<Profile>) {
        Object.assign(this, partial);
    }
}