import { Request, Response, NextFunction } from "express";
import HttpError from "../../../util/http-errors";
import User from "../../../models/user/user";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "./SendEmail";
import Token, { IToken } from "../../../models/user/token";
import {
  checkValidationResult,
  handleUnknownServerError,
  handleUserNotFound,
  handleUserSignupRequired,
} from "../../helper-controllers";

let JWT_KEY: string = process.env.JWT_KEY || "";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  checkValidationResult(req, res, next);

  const { email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email: email });
    if (!existingUser) return handleUserNotFound(next);
    if (!existingUser.token) return handleUserSignupRequired(next);
    if (existingUser.deactivated_at !== null) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      if (!(existingUser.deactivated_at >= thirtyDaysAgo)) {
        return next(
          new HttpError(
            "Your account has been deleted due to 30 days of inactivity after deactivation. Please sign up again or proceed to the account recovery section for assistance.",
            404
          )
        );
      }
    }

    let isValidPassword: boolean;
    try {
      isValidPassword = await bcrypt.compare(
        password,
        existingUser.password as string
      );
    } catch (err) {
      return next(
        new HttpError(
          "Could not log you in, please check your credentials and try again.",
          500
        )
      );
    }

    // If the password is not valid, return an error
    if (!isValidPassword) {
      return next(
        new HttpError("Invalid credentials, could not log you in.", 401)
      );
    }

    let token: string;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        JWT_KEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      return next(
        new HttpError("Logging in failed, please try again later.", 500)
      );
    }

    // Send the token and user details in the response
    res.status(200).json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 500)
    );
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  checkValidationResult(req, res, next);

  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    let existingUser = await User.findOne({ email: email });

    // If the user exists and has a token, return an error
    if (existingUser && existingUser.token) {
      return next(
        new HttpError("User exists already, please login instead.", 422)
      );
    }

    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return next(
        new HttpError("Could not create user, please try again.", 500)
      );
    }

    // If the user exists but doesn't have a token, update the user with new data
    if (existingUser) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      await existingUser.save();
    } else {
      // If the user doesn't exist, create a new user
      const username = uuidv4();

      const createdUser = new User({
        name,
        username,
        email,
        password: hashedPassword,
        saved: [],
        account_info: {
          username,
          email,
          phone: "",
          country: "",
          language: "",
          gender: "",
          birth_day: "",
          tag: [],
        },
      });

      await createdUser.save();
    }

    // Call sendOTP function and pass the entire request body
    await sendOTP(req, res, next);

    // Do not send a response here
  } catch (err) {
    console.log(err);
    return next(new HttpError("Signing up failed, please try again.", 500));
  }
};

// logic related to forgot password and reset

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    checkValidationResult(req, res, next);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new HttpError("User with given email doesn't exist", 400));
    }

    let OTPtoken = await Token.findOne({ userId: user._id });

    // Generate a random 6-digit OTP
    const generateOTP = () => {
      const otp = Math.floor(100000 + Math.random() * 900000);
      return otp.toString(); // Convert to string
    };

    // Check if token exists
    if (!OTPtoken) {
      // Create a new token document
      OTPtoken = await Token.create({
        userId: user._id,
        token: generateOTP(),
      });
    } else {
      // Update existing token with a new OTP
      OTPtoken.token = generateOTP();
      await OTPtoken.save(); // Save the updated token document
    }

    const subject = user.token ? "Password Reset" : "Signup OTP Verification";

    const msg = `Your OTP for the given ${
      user.token ? "password reset" : "signup verification"
    } is: ${OTPtoken.token}`;

    await sendEmail(user.email, subject, msg);

    if (req.body.name) {
      res.status(200).json({
        userId: user._id,
        email: req.body.email,
        message: "OTP send to your entered email, please verify!",
      });
    } else {
      res.status(200).json("Password reset OTP sent to your email account");
    }
  } catch (error) {
    handleUnknownServerError(next);
  }
};

export const resetPasswordAndVerifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    checkValidationResult(req, res, next);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    const OTPtoken = await Token.findOne({
      userId: user._id,
      token: req.body.otp,
    });
    if (!OTPtoken) {
      return res.status(400).json({ message: "Invalid link or expired" });
    }

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
      await user.save();
      await OTPtoken.deleteOne();
      return res.status(200).json({ message: "Password reset successfully" });
    } else {
      user.token = true;
      await user.save();
      await OTPtoken.deleteOne();

      let token: string;
      try {
        token = jwt.sign({ userId: user._id, email: user.email }, JWT_KEY, {
          expiresIn: process.env.JWT_KEY_EXPIRE,
        });
        return res.status(201).json({ userId: user._id, token: token });
      } catch (err) {
        return next(
          new HttpError("Signing up failed, please try again later.", 500)
        );
      }
    }
  } catch (error) {
    handleUnknownServerError(next);
  }
};

export const getResetTimer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // If user not found, handle the case appropriately
      return res.status(404).json({ message: "User not found" });
    }

    // Find the token associated with the user's _id
    const token: IToken | null = await Token.findOne({ userId: user._id });

    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }

    // Assuming you have access to the Mongoose schema definition
    const expirationDurationInSeconds =
      Token.schema.path("createdAt").options.expires;

    // Convert expiration duration to milliseconds
    const expirationTime = expirationDurationInSeconds * 1000;

    res.status(200).json(expirationTime);
  } catch (error) {
    handleUnknownServerError(next);
  }
};
