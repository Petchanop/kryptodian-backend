import { Portfolio } from "src/portfolio/entities/portfolio.entity";
import { User } from "src/user/entities/user.entity";
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
        cascade: true
    })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user: User

    // implement Portfolio later
    @OneToMany(() => Portfolio, (portfolio) => portfolio.profile)
    portfolio: Portfolio[];

    constructor(partial: Partial<Profile>) {
        Object.assign(this, partial);
    }
}