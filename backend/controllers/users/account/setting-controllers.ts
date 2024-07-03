import { Request, Response, NextFunction } from "express";
import HttpError from "../../../util/http-errors";
import User, { IUser } from "../../../models/user/user";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import {
  checkValidationResult,
  handleUnknownServerError,
  handleUserNotFound,
  handleUserSignupRequired,
} from "../../helper-controllers";

export const getAccountInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { password } = req.body;

  checkValidationResult(req, res, next);

  try {
    let existingUser = await User.findById(userId);
    if (!existingUser) return handleUserNotFound(next);
    if (!existingUser.token) return handleUserSignupRequired(next);

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return next(
        new HttpError("Invalid credentials, could not proceed.", 401)
      );
    }

    res.status(200).json(existingUser.account_info);
  } catch (err) {
    return next(
      new HttpError("Getting account info failed, please try again later.", 500)
    );
  }
};

export const editAccountInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const { field, value } = req.body;

    let existingUser = await User.findById(userId);
    if (!existingUser) return handleUserNotFound(next);
    if (!existingUser.token) return handleUserSignupRequired(next);

    if (field === "email" || field === "username") {
      const exists = await User.exists({ [field as keyof IUser]: value });
      if (exists) {
        return next(new HttpError(`${field
          .split("_")
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")} already exists.`, 400));
      }
      if (field === "email") {
        existingUser.old_email = existingUser.email;
      }
      (existingUser as any)[field as keyof IUser] = value;
    } else {
      if (!(field in existingUser.account_info)) {
        return next(new HttpError(`${field} doesn't exist.`, 400));
      }
      existingUser.account_info[
        field as keyof typeof existingUser.account_info
      ] = value;
    }

    await existingUser.save();

    res.status(200).json({
      message: `${field
        .split("_")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")} updated!`,
    });
  } catch (err) {
    return next(
      new HttpError("Editing info failed, please try again later.", 500)
    );
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Please check your entry and submit again.", 422)
    );
  }

  const { email, password, newPassword } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (!existingUser)
      return next(
        new HttpError("Incorrect email or password. Please try again.", 401)
      );
    if (!existingUser.token) return handleUserSignupRequired(next);

    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword)
      return next(
        new HttpError("Incorrect email or password. Please try again.", 401)
      );

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    return next(
      new HttpError("Changing password failed, please try again later.", 500)
    );
  }
};

export const deactivateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return next(new HttpError("User not found.", 404));

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return next(new HttpError("Invalid password.", 401));

    user.deactivated_at = new Date();
    await user.save();

    res.json({ message: "Account deactivated successfully." });
  } catch (error) {
    handleUnknownServerError(next);
  }
};

export const deactivateAt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return next(new HttpError("User not found.", 404));

    if (user.deactivated_at !== null) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (user.deactivated_at >= thirtyDaysAgo) {
        return res
          .status(200)
          .json({ message: "Do you like to re-activate your account?" });
      } else {
        return next(
          new HttpError("User account seem deleted after deactivation.", 404)
        );
      }
    }
  } catch (error) {
    handleUnknownServerError(next);
  }
};

export const reactivateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return next(new HttpError("User not found.", 404));

    if (user.deactivated_at !== null) {
      // Calculate the date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (user.deactivated_at >= thirtyDaysAgo) {
        user.deactivated_at = null;
        await user.save();
        return res
          .status(200)
          .json({ message: "Account reactivated successfully." });
      } else {
        return next(
          new HttpError(
            "30 days of in-active period, after deactivation lead to deletion of your account.",
            404
          )
        );
      }
    }
  } catch (error) {
    return next(
      new HttpError(
        "Re-activating your account failed, please try again later.",
        500
      )
    );
  }
};
