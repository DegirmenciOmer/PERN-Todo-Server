import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  user: 'postgres',
  password: process.env.DB_PASSWORD,
  host: '127.0.0.1',
  port: process.env.port,
  database: 'perntodo',
})

export default pool
