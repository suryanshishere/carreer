import { Request, Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "./send-email";
import User, { IUser } from "@models/user/user-model";
import {
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
    let existingUser: IUser | null;

    //doing this to prevent extra processing time for email search
    if (userId) {
      existingUser = await User.findById(userId);
    } else {
      existingUser = await User.findOne({ email });
    }

    if (!existingUser || !existingUser.isEmailVerified) {
      //if user email not verified send user not found for password reset
      return next(new HttpError("User not found!", 404));
    }

    //check too many request to prevent reset link send to email
    const delayInSeconds = existingUser.passwordResetTokenCreatedAt
      ? checkRequestDelay(existingUser.passwordResetTokenCreatedAt, 60)
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

    existingUser.passwordResetToken = generateUniqueVerificationToken();
    existingUser.passwordResetTokenCreatedAt = new Date();
    await existingUser.save();

    await sendEmail(
      next,
      existingUser.email,
      "Reset your password (Valid for 3min)",
      `${FRONTEND_URL}/${existingUser.id + existingUser.passwordResetToken}`
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
            " second(s) or verify your last OTP sent",
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
      message: "OTP sent to your email successfully",
    });
  } catch (error) {
    return next(
      new HttpError("Error sending verification email, try again later", 500)
    );
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate request
  validationError(req, res, next);

  const { otp } = req.body;
  const userId = req.headers.userid as string;

  try {
    // Find the user by ID and validate existence
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return next(new HttpError("User not found. Please sign up again.", 404));
    }

    // Verify the existence of the OTP and its creation date
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

    // Validate OTP
    if (existingUser.emailVerificationToken !== otp) {
      return next(new HttpError("Invalid OTP. Please try again.", 400));
    }

    // Check if the OTP has expired (e.g., 15 minutes)
    const tokenExpirationTime = new Date(
      existingUser.emailVerificationTokenCreatedAt.getTime() +
        EMAIL_VERIFICATION_TOKEN_EXPIRY * 60 * 1000
    );
    const currentTime = new Date();

    if (currentTime > tokenExpirationTime) {
      return next(
        new HttpError(
          "The OTP has expired. Please request a new verification email.",
          410
        )
      );
    }

    // Mark email as verified and clear the verification token data
    existingUser.isEmailVerified = true;
    existingUser.emailVerificationToken = undefined;
    existingUser.emailVerificationTokenCreatedAt = undefined;

    await existingUser.save();
    return res
      .status(200)
      .json({ message: "Your email has been successfully verified." });
  } catch (error) {
    return next(
      new HttpError(
        "An unexpected error occurred. Please try again later.",
        500
      )
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
        username: uuidv4(), //TODO
        email,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationTokenCreatedAt: new Date(),
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

  const { resetPasswordToken, password } = req.body;
  const userId = req.headers.userid;

  try {
    // Find user and validate existence and email verification
    const existingUser = await User.findById(userId);
    if (!existingUser || !existingUser.isEmailVerified) {
      return next(new HttpError("User not found or email not verified", 404));
    }

    // Check if password reset was requested and valid token exists
    if (
      !existingUser.passwordResetToken ||
      !existingUser.passwordResetTokenCreatedAt
    ) {
      return next(
        new HttpError(
          "No password reset request found. Please initiate a new password reset request.",
          400
        )
      );
    }

    // Validate provided reset token
    if (
      !resetPasswordToken ||
      existingUser.passwordResetToken !== resetPasswordToken
    ) {
      return next(new HttpError("Invalid reset token", 400));
    }

    // Validate token expiration (3 minutes)
    const tokenExpirationTime = new Date(
      existingUser.passwordResetTokenCreatedAt.getTime() +
        PASSWORD_RESET_TOKEN_EXPIRY * 60 * 1000
    );
    const currentTime = new Date();

    if (currentTime > tokenExpirationTime) {
      return next(
        new HttpError(
          "Reset token has expired. Please request a new password reset link.",
          410
        )
      );
    }

    // Hash new password
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return next(
        new HttpError("Failed to reset password. Please try again later.", 500)
      );
    }
    // Check if new password is similar to the old one (before updating)
    const isPasswordSimilar = await bcrypt.compare(
      password,
      existingUser.password
    );

    // Update user password and clear reset data
    existingUser.password = hashedPassword;
    existingUser.passwordChangedAt = currentTime;
    existingUser.passwordResetToken = undefined;
    existingUser.passwordResetTokenCreatedAt = undefined;

    if (!existingUser.isEmailVerified) {
      existingUser.isEmailVerified = true;
      existingUser.emailVerificationToken = undefined;
      existingUser.emailVerificationTokenCreatedAt = undefined;
    }

    await existingUser.save();

    const message = isPasswordSimilar
      ? "Password updated successfully, but it resembles a previous password. We recommend choosing a new, unique password for added security."
      : "Password updated successfully.";

    return res.status(200).json({ message });
  } catch (error) {
    return next(
      new HttpError(
        "An unexpected error occurred. Please try again later.",
        500
      )
    );
  }
};
