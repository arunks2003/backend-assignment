import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const con = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT), // Ensure port is a number
});

export default con;
