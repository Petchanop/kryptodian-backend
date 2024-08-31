import { Column, Entity } from "typeorm";

@Entity()
export class AuthToken {
    @Column()
    token: string;
}
