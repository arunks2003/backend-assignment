import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const con = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT), // Ensure port is a number
  ssl: {
    rejectUnauthorized: false,
  },
});

export default con;
