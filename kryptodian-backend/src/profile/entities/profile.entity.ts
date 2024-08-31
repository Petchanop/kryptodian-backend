import { Portfolio } from "src/portfolio/entities/portfolio.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @PrimaryColumn()
    firstName: string;

    @PrimaryColumn()
    lastName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne((type) => User, (user) => user.profile ,{
        cascade: true
      })
    @JoinColumn({ name: "userId", referencedColumnName: "id" })
    user: User

    // implement Portfolio later
    @OneToMany(() => Profile, (profile) => profile.portfolio)
    portfolio: Portfolio[];

    constructor(partial: Partial<Profile>) {
        Object.assign(this, partial);
    }
}