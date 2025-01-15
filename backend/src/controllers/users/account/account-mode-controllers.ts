import { JWTRequest } from "@middleware/check-auth";
import UserModal from "@models/user/user-model";
import { accountModeType, USER_ENV_DATA } from "@shared/env-data";
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";

export const modeAccountHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mode } = req.body;

    // Check if 'mode' is an object and not empty
    if (!mode || typeof mode !== "object" || Object.keys(mode).length === 0) {
      return next(new HttpError("Invalid mode data provided", 400));
    }

    const userId = (req as JWTRequest).userData.userId;
    const user = await UserModal.findById(userId);

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    // Initialize user.mode if it doesn't exist
    if (!user.mode) {
      user.mode = [];
    }

    // Iterate over each key-value pair in the mode object
    for (const [key, value] of Object.entries(mode)) {
      // Validate the key
      if (!USER_ENV_DATA.ACCOUNT_MODE.includes(key as accountModeType)) {
        return next(
          new HttpError(
            `Invalid mode key '${key}', must be one of: ${USER_ENV_DATA.ACCOUNT_MODE.join(
              ", "
            )}`,
            400
          )
        );
      }

      // Validate that the value is a boolean
      if (typeof value !== "boolean") {
        return next(
          new HttpError(`Mode value for '${key}' must be a boolean`, 400)
        );
      }

      // If the value is true, add the key to the mode array if not already present
      if (value) {
        if (!user.mode.includes(key as accountModeType)) {
          user.mode.push(key as accountModeType);
        }
      } else {
        // If the value is false, remove the key from the mode array
        user.mode = user.mode.filter((modeItem) => modeItem !== key);
      }
    }

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: `Modes updated successfully.`,
    });
  } catch (error) {
    console.error("Error updating mode:", error);
    return next(
      new HttpError("Updating modes failed, please try again later.", 500)
    );
  }
};
