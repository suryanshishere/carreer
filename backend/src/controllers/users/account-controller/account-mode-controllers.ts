import { JWTRequest } from "@middlewares/check-auth";
import UserModal from "@models/users/User";
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";

export const modeAccountHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mode } = req.body;
    const { max } = mode;

    // Ensure 'mode' is an object and contains only valid keys from the model (e.g., 'max')
    if (typeof mode !== "object" || Object.keys(mode).length === 0) {
      return next(new HttpError("Invalid mode data provided", 400));
    }

    const userId = (req as JWTRequest).userData.userId;
    const user = await UserModal.findById(userId);

    if (!user) {
      return next(new HttpError("User not found!", 404));
    }

    user.mode.max = max;

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      message: `Modes updated successfully.`,
      mode: user.mode, // Return the updated mode to the client
    });
  } catch (error) {
    console.error("Error updating mode:", error);
    return next(
      new HttpError("Updating modes failed, please try again later.", 500)
    );
  }
};
