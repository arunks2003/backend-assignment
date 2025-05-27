import express from "express";
import { Client } from "pg";
import { connectDB } from "./db/db.js";
import con from "./db/dbObject.js";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
dotenv.config();

// console.log(typeof process.env.DB_PASSWORD);

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;

connectDB(con);

//routes
app.use("/api/v1/users", userRouter);
//httpslocalhost:8080/api/v1/users

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
