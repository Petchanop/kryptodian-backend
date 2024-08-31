import { Profile } from "src/profile/entities/profile.entity";
import { CreateDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Portfolio {

    @PrimaryColumn()
    network: string;

    @PrimaryColumn()
    wallet: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Portfolio, (portfolio) => portfolio.profile)
    @JoinTable()
    profile: Profile;
}