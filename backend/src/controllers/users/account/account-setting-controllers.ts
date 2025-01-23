<<<<<<< HEAD:backend/controllers/users/account/setting-controllers.ts
import validationError from "@controllers/controllersUtils/validation-error";
=======
>>>>>>> user:backend/src/controllers/users/account/account-setting-controllers.ts
import User from "@models/user/user-model";
import HttpError from "@utils/http-errors";
import { NextFunction, Response, Request } from "express";
import bcrypt from "bcryptjs";
<<<<<<< HEAD:backend/controllers/users/account/setting-controllers.ts
import { JWTRequest } from "@middleware/check-auth";
import { validationResult } from "express-validator";
=======
import { getUserIdFromRequest, JWTRequest } from "@middleware/check-auth";
import handleValidationErrors from "@controllers/sharedControllers/validation-error";
>>>>>>> user:backend/src/controllers/users/account/account-setting-controllers.ts

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
<<<<<<< HEAD:backend/controllers/users/account/setting-controllers.ts
  const errors =validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(validationError(errors), 400));
    }
=======
  handleValidationErrors(req, next);

>>>>>>> user:backend/src/controllers/users/account/account-setting-controllers.ts
  try {
    const { old_password, new_password } = req.body;
    const userId = getUserIdFromRequest(req as JWTRequest);
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

export const deactivateAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
<<<<<<< HEAD:backend/controllers/users/account/setting-controllers.ts
  const errors =validationResult(req);
    if (!errors.isEmpty()) {
      return next(new HttpError(validationError(errors), 400));
    }
=======
  handleValidationErrors(req, next);

>>>>>>> user:backend/src/controllers/users/account/account-setting-controllers.ts
  try {
    const userId = getUserIdFromRequest(req as JWTRequest);
    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found!", 404));
    }
    user.deactivated_at = new Date();
    await user.save();

    return res
      .status(200)
      .json({ message: "Account deactivated successfully!" });
  } catch (error) {}
};
