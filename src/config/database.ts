import 'reflect-metadata'
import { DataSource } from 'typeorm'
import 'dotenv/config'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  synchronize: true,
  // logging: true,
  entities: [__dirname + '/../**/*.model.{ts,js}'],
  migrations: [__dirname + '/../migrations/*.{ts,js}'],
  ssl: {
    rejectUnauthorized: false
  }
})