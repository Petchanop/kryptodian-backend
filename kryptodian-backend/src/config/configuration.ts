import { Portfolio } from "../portfolio/entities/portfolio.entity";
import { Profile } from "../profile/entities/profile.entity";
import { User } from "../user/entities/user.entity";
import { DataSource } from "typeorm";

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});

//db configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DB_USER,
  password: `${process.env.DB_PASSWORD}`,
  entities: [User, Profile, Portfolio],
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
})

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err)
  })