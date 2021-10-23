import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgres://localhost:5432/perntodo',
  ssl: {
    rejectUnauthorized: false,
  },

  user: 'postgres',
  password: process.env.DB_PASSWORD,
  host: '5432',
  port: process.env.port,
  database: 'perntodo',
})

export default pool
