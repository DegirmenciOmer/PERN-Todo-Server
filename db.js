import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.PG_HOST,
  port: 5432,
  database: process.env.PG_DATABASE,
  ssl: true,
})

// const pool = new Pool({
//   user: 'postgres',
//   password: process.env.DB_PASSWORD,
//   host: 'localhost',
//   port: 5432,
//   database: 'perntodo',
// })

export default pool
