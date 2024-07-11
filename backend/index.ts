import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import examsRoutes from "./routes/exams/exams-routes";
import adminRoutes from "./routes/admin/admin-routes";
import usersRoutes from "./routes/users/user-routes";
import HttpError from "./util/http-errors";
import ExamDetail from "./models/exam/examDetail";

// Declare the type of MONGO_URL explicitly
const MONGO_URL: string = process.env.DB || "";

const app = express();

app.use(bodyParser.json());

app.use(cors());

// app.use("/api/admin", adminRoutes);
app.use("/api/users", usersRoutes);
app.use("/api", examsRoutes);

//Error showign if none of the routes found!
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

//Error handling if above none got caught
// app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
//   const statusCode = error.code || 500;
//   const errorMessage = error.message || "An unknown error occurred!";
//   res.status(statusCode).json({ message: errorMessage });
// });

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(5050, () => {
      console.log("Server is running on port 5050");
    });
  })
  .catch((err) => console.log(err));
