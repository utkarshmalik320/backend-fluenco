
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import userRouter from "./routes/user.routes.js";  
import {app} from "./app.js";
connectDB();

app.use(
  cors({
    origin: "*",
  })
);

dotenv.config({ path: "./env" });

const port = process.env.PORT || 3000;

app.listen(port ,() => {
  console.log("listening on port " + port);
});



