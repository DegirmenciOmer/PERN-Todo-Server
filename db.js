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

const { Pool } = require('pg')

const pool = new Pool({
  user: process.env.PG_USER, //postgres user
  host: process.env.PG_ENDPOINT, //localhost (I also tried 127.0.0.1)
  database: process.env.PG_DB, //database name to connect to
  password: process.env.PG_PASS, //postgres user password
  port: process.env.PG_PORT, //5432
})

export default pool
