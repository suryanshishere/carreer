import User, { IUser } from "@models/user/user-model";
import HttpError from "@utils/http-errors";
import { NextFunction, Response } from "express";
import { Request } from "express-jwt";

const activateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userData.userId;
  try {
    const user: IUser | null = await User.findById(userId);
    if (!user) return next(new HttpError("User not found!", 404));

    if (!user.deactivated_at)
      return next(
        new HttpError("User account seem to be active already.", 400)
      );

    user.deactivated_at = undefined;
    user.save();

    return res.status(200).json({ message: "Account activated successfully!" });
  } catch (error) {
    return next(
      new HttpError("Activating your account failed, please try again.", 500)
    );
  }
};

export default activateAccount;
