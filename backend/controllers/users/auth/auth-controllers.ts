import { Request, Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
// import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "./send-email";
import User, { IUser } from "@models/user/user-model";
import {
  calculateTokenExpiration,
  checkRequestDelay,
  generateUniqueVerificationToken,
  sendAuthenticatedResponse,
  sendVerificationResponse,
  updateUnverifiedUser,
} from "./auth-utils";
import validationError from "../../controllersHelpers/validation-error";

const FRONTEND_URL =
  `${process.env.FRONTEND_URL}/user/reset_password` ||
  "http://localhost:3000/user/reset_password";
// const JWT_KEY = process.env.JWT_KEY;
// const JWT_KEY_EXPIRY = process.env.JWT_KEY_EXPIRY || "15";
const EMAIL_VERIFICATION_TOKEN_EXPIRY =
  Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY) || 3;
const PASSWORD_RESET_TOKEN_EXPIRY =
  Number(process.env.PASSWORD_RESET_TOKEN_EXPIRY) || 3;

export const sendPasswordResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);
  const { email } = req.body;
  const userId = req.headers.userid as string;
  try {
    let user: IUser|null;

    //doing this to prevent extra processing time for email search
    if (userId) {
      user = await User.findById(userId);
    }else{
      user = await User.findOne({ email });
    }

    if (!user) return next(new HttpError("User not found", 404));

    //check too many request to prevent reset link send to email
    const delayInSeconds = user.passwordResetTokenCreatedAt
      ? checkRequestDelay(user.passwordResetTokenCreatedAt, 60)
      : null;

    if (delayInSeconds !== null) {
      return next(
        new HttpError(
          `Please wait ${delayInSeconds} second(s) or use the last reset link.`,
          429,
          delayInSeconds
        )
      );
    }

    user.passwordResetToken = generateUniqueVerificationToken();
    user.passwordResetTokenCreatedAt = new Date();
    await user.save();

    await sendEmail(
      next,
      user.email,
      "Reset your password (Valid for 3min)",
      `${FRONTEND_URL}/${user.id+user.passwordResetToken}`
    );

    return res
      .status(200)
      .json({ message: "Reset password link sent successfully." });
  } catch (err) {
    return next(
      new HttpError(
        "An error occurred while sending the reset link. Please try again later.",
        500
      )
    );
  }
};

export const sendVerificationOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
  options: { userId?: string; email?: string; isDirect?: boolean } = {}
) => {
  if (!options.isDirect) {
    validationError(req, res, next);
  }
  // Use userId and email from options if provided, otherwise from req.body
  const userId = options.userId || req.headers.userid;

  try {
    // Find the user by ID if not directly passed as an email option
    let user: IUser | null = null;
    if (!options.email) {
      user = await User.findById(userId);
      if (!user) {
        return next(new HttpError("User not found", 404));
      } else if (user.isEmailVerified) {
        return next(new HttpError("User email already verified", 409));
      }
    }

    const delayInSeconds = checkRequestDelay(
      user?.emailVerificationTokenCreatedAt,
      60
    );
    if (delayInSeconds !== null) {
      return next(
        new HttpError(
          "Please wait for " +
            delayInSeconds +
            " second(s) or verify your last OTP sent.",
          429,
          delayInSeconds
        )
      );
    }

    const emailToSend = options.email || user?.email;
    if (!emailToSend) {
      return next(new HttpError("Email address is required", 400));
    }

    // Generate a verification token and set expiration
    const verificationToken = generateUniqueVerificationToken();
    if (user) {
      user.emailVerificationToken = verificationToken;
      user.emailVerificationTokenCreatedAt = new Date();
      await user.save();
    }

    // Define email content
    const emailSubject = "Verify your email through OTP (Valid for 3min)";
    const emailContent = `${verificationToken}`;

    // Send email
    await sendEmail(next, emailToSend, emailSubject, emailContent);

    // If `isDirect`, skip the response
    if (options.isDirect) return;

    // Respond to client
    res.status(200).json({
      message: "OTP sent to your email successfully.",
    });
  } catch (error) {
    return next(
      new HttpError("Error sending verification email, try again later.", 500)
    );
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check for validation errors
  validationError(req, res, next);

  const { otp } = req.body;
  const userId = req.headers.userid as string;

  try {
    // Find the user by ID
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return next(new HttpError("User not found. Please sign up again", 404));
    }

    // Check if the email verification token and created date exist
    if (
      !existingUser.emailVerificationToken ||
      !existingUser.emailVerificationTokenCreatedAt
    ) {
      return next(
        new HttpError(
          "OTP verification was not requested. Please resend the OTP and try again.",
          400
        )
      );
    }

    // Check if the provided OTP matches the user's token
    if (existingUser.emailVerificationToken !== otp) {
      return next(new HttpError("Invalid verification credentials.", 400));
    }

    // Calculate the token expiration time
    const tokenExpirationTime = new Date(
      existingUser.emailVerificationTokenCreatedAt.getTime() +
        EMAIL_VERIFICATION_TOKEN_EXPIRY * 60 * 1000
    );

    // Check if the current time is within the token's valid period
    if (new Date() <= tokenExpirationTime) {
      existingUser.isEmailVerified = true;
      existingUser.emailVerificationToken = undefined;
      existingUser.emailVerificationTokenCreatedAt = undefined;

      await existingUser.save();
      return res.status(200).json({ message: "Email successfully verified." });
    } else {
      return next(
        new HttpError(
          "Expired verification token. Please request a new verification email.",
          400
        )
      );
    }
  } catch (error) {
    return next(
      new HttpError("Internal server error. Please try again later.", 500)
    );
  }
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validationError(req, res, next);

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    const verificationToken = generateUniqueVerificationToken();

    if (existingUser) {
      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password as string
      );
      if (!existingUser.isEmailVerified) {
        await updateUnverifiedUser(existingUser, password);
        return sendVerificationResponse(req, res, next, existingUser);
      }
      if (!isValidPassword) {
        return next(
          new HttpError("Invalid credentials, could not log you in.", 401)
        );
      }

      return sendAuthenticatedResponse(res, existingUser);
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        username: uuidv4(),
        email,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationTokenCreatedAt: calculateTokenExpiration(
          EMAIL_VERIFICATION_TOKEN_EXPIRY
        ),
      });
      await newUser.save();

      return sendVerificationResponse(req, res, next, newUser);
    }
  } catch (err) {
    return next(new HttpError("Authentication failed, please try again.", 500));
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);

  const { resetToken, password } = req.body;

  if (resetToken.length != 30) {
    return next(new HttpError("Invalid verification credentials.", 400));
  }

  const userId = resetToken.slice(0, -6);
  const emailVerificationToken = resetToken.slice(-6);
  try {
    const existingUser = await User.findOne({ _id: userId });

    if (existingUser) {
      if (
        emailVerificationToken != null &&
        existingUser.emailVerificationToken === emailVerificationToken &&
        existingUser.emailVerificationTokenCreatedAt instanceof Date
      ) {
        // Check if token is still valid (within 3 minutes)
        const tokenExpirationTime = new Date(
          existingUser.emailVerificationTokenCreatedAt.getTime() +
            EMAIL_VERIFICATION_TOKEN_EXPIRY * 60 * 1000
        ); // 3 minutes in milliseconds
        const currentTime = new Date();

        if (currentTime <= tokenExpirationTime) {
          let hashedPassword: string;
          try {
            hashedPassword = await bcrypt.hash(password, 12);
          } catch (err) {
            return next(
              new HttpError(
                "Could not create account right now, please try again.",
                500
              )
            );
          }

          existingUser.password = hashedPassword;
          existingUser.passwordChangedAt = currentTime;
          existingUser.isEmailVerified = true;
          existingUser.emailVerificationToken = undefined;
          existingUser.emailVerificationTokenCreatedAt = undefined;

          await existingUser.save();
          return res
            .status(200)
            .json({ message: "Password changed successfully." });
        } else {
          return next(
            new HttpError(
              "Expired reset link. Please request a new password link on your email.",
              400
            )
          );
        }
      } else {
        return next(new HttpError("Invalid verification credentials.", 400));
      }
    } else {
      return next(new HttpError("User not found. Please sign up again.", 404));
    }
  } catch (error) {
    return next(
      new HttpError(
        "Internal server error. Please try again later using the same link before it expires.",
        500
      )
    );
  }
};
