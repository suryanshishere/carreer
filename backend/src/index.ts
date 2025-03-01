import "module-alias/register";
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import postsRoutes from "@routes/posts/posts-routes";
import adminRoutes from "@routes/admin/admin-routes";
import otherRoutes from "@routes/other/other-routes";
import usersRoutes from "@routes/users/user-routes";
import HttpError from "@utils/http-errors";
import userCleanupTask from "@middleware/cronJobs/user-cleanup-task";
import checkAuth from "@middleware/check-auth";
import checkAccountStatus from "@middleware/check-account-status";
import activateAccount from "@middleware/activate-account";
import { deletePost } from "@controllers/admin/publisher/publisher-controllers";

const MONGO_URL: string = process.env.MONGO_URL || "";
const LOCAL_HOST = process.env.LOCAL_HOST || 5050;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.delete("/api/deletePost", deletePost);
app.use(checkAuth);
app.post("/api/user/account/activate-account", activateAccount);
app.use(checkAccountStatus);

app.use("/api/public", postsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/other", otherRoutes);

//Error showing if none of the routes found!
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new HttpError("Could not find this route.", 404));
});

//httperror middleware use here to return a valid json error instead any html error page
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.code || 500;
  const errorMessage = error.message || "An unknown error occurred!";

  const response = {
    message: errorMessage,
    ...(error.extraData && { extraData: error.extraData }),
  };

  res.status(statusCode).json(response);
});

//todo
userCleanupTask();

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(Number(LOCAL_HOST), () => {
      console.log(`Server is running on port ${LOCAL_HOST}`);
    });
  })
  .catch((err) => console.log(err));
