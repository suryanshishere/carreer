import "module-alias/register";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import postsRoutes from "./routes/posts/posts-routes";
import HttpError from "./utils/http-errors";

const MONGO_URL: string = process.env.MONGO_URL || "";
const LOCAL_HOST = process.env.LOCAL_HOST || 5050;

const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use("/api", postsRoutes);

//Error showing if none of the routes found!
app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

//httperror middleware use here to return a valid json error instead any html error page
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.code || 500;
  const errorMessage = error.message || "An unknown error occurred!";
  res.status(statusCode).json({ message: errorMessage });
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(Number(LOCAL_HOST), () => {
      console.log(`Server is running on port ${LOCAL_HOST}`);
    });
  })
  .catch((err) => console.log(err));
