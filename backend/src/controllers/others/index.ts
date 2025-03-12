import { JWTRequest } from "@middlewares/check-auth";
import HttpError from "@utils/http-errors";
import { NextFunction, Request, Response } from "express";
import ContactUs from "@models/others/contact-us-model";

export const contactUs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, reason } = req.body;
    const userId = (req as JWTRequest).userData.userId;

    const contactRequest = new ContactUs({
      user_id: userId,
      name,
      email,
      reason,
    });

    await contactRequest.save();

    return res
      .status(201)
      .json({ message: "Contact request submitted successfully." });
  } catch (error) {
    console.error("Error saving contact request:", error);
    return next(new HttpError("Error occurred while sending, try again!", 500));
  }
};
