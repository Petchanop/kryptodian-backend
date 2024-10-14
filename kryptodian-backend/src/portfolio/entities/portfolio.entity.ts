import { Profile } from "../../profile/entities/profile.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Portfolio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    network: string;

    @Column()
    wallet: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Profile, (profile) => profile.portfolio ,{
        cascade : ["update", "insert"]
    })
    profile: Profile;

    constructor(partial: Partial<Portfolio>) {
        Object.assign(this, partial);
    }
}