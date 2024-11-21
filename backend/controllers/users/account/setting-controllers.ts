import validationError from "@controllers/controllersHelpers/validation-error";
import User from "@models/user/user-model";
import HttpError from "@utils/http-errors";
import { NextFunction, Response } from "express";
import bcrypt from "bcryptjs";
import { Request } from "express-jwt";

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    validationError(req, res, next);

    const { old_password, new_password } = req.body;
    const { userId } = req.userData;
    
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return next(new HttpError("Old password is incorrect.", 400));
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(new_password, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    return next(
      new HttpError(
        "Unable to change your password at this time. Please try again later.",
        500
      )
    );
  }
};
