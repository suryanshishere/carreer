import { Response, NextFunction, Request } from "express";
import HttpError from "@utils/http-errors";
import bcrypt from "bcryptjs";
import sendEmail from "./send-email";
import User, { IUser } from "@models/users/User";
import {
  checkRequestDelay,
  sendAuthenticatedResponse,
  sendVerificationResponse,
  updateUnverifiedUser,
} from "./auth-controllers-utils";
import { random } from "lodash";
import handleValidationErrors from "../../utils/validation-error";
import { USER_ENV_DATA } from "@models/users/db";
import { OAuth2Client } from "google-auth-library";

const { EMAIL_VERIFICATION_OTP_EXPIRY, PASSWORD_RESET_TOKEN_EXPIRY } =
  USER_ENV_DATA;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const errors = handleValidationErrors(req, next);
  if (errors) return;

  // Get potential googleToken along with email and password
  const { email, password, googleToken } = req.body;

  // If a googleToken is provided, handle Google Authentication
  if (googleToken) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload?.email) {
        return next(
          new HttpError("Google authentication failed: no email found.", 401)
        );
      }

      // Check if a user with this email exists; if not, create one
      let user: IUser | null = await User.findOne({ email: payload.email });
      if (!user) {
        user = new User({
          email: payload.email,
          // Optionally store additional profile info from payload
          // name: payload.name,
          isEmailVerified: true, // Mark email as verified from Google
          // You might want to set a random password or flag this account as Google only
          password: await bcrypt.hash(random(100000, 999999).toString(), 12),
        });
        await user.save();
      }

      return sendAuthenticatedResponse(res, user);
    } catch (error) {
      console.error("Google Auth error:", error);
      return next(new HttpError("Google authentication failed.", 500));
    }
  }

  // Proceed with the existing email/password authentication logic
  try {
    const existingUser: IUser | null = await User.findOne({ email });
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
        email,
        password: hashedPassword,
        emailVerificationToken: random(100000, 999999),
        emailVerificationTokenCreatedAt: new Date(),
      });
      await newUser.save();

      return sendVerificationResponse(req, res, next, newUser);
    }
  } catch (err) {
    console.error(err);
    return next(new HttpError("Authentication failed, please try again.", 500));
  }
};

//forgot password
export const sendPasswordResetLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = handleValidationErrors(req, next);
  if (errors) return;

  const { email } = req.body;
  const userId = req.userData?.userId;

  try {
    let existingUser: IUser | null;

    if (userId) {
      existingUser = await User.findById(userId);
    } else {
      existingUser = await User.findOne({ email });
    }

    if (!existingUser || !existingUser.isEmailVerified) {
      return next(new HttpError("User not found!", 404));
    }

    if (userId && existingUser.email !== email) {
      return next(
        new HttpError("User does not match the provided email!", 404)
      );
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

    existingUser.passwordResetToken = random(100000, 999999);
    existingUser.passwordResetTokenCreatedAt = new Date();

    await existingUser.save();

    const FRONTEND_URL = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/user/reset-password`
      : "http://localhost:3000/user/reset-password";

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

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = handleValidationErrors(req, next);
  if (errors) return;

  const { resetPasswordToken, password } = req.body;
  const { userId } = req.params;
  try {
    // Find user and validate existence and email verification
    const existingUser = await User.findById(userId);
    if (!existingUser || !existingUser.isEmailVerified) {
      return next(new HttpError("User not found or email not verified!", 404));
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
      return next(new HttpError("Invalid reset token!", 400));
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

    if (isPasswordSimilar) {
      return next(
        new HttpError(
          "The new password cannot be the same as your current password. Please choose a different password or log in to update your credentials in the settings.",
          400 // Bad Request
        )
      );
    }

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

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    return next(
      new HttpError(
        "An unexpected error occurred. Please try again later.",
        500
      )
    );
  }
};

//authenticated
export const sendVerificationOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
  options: {
    userId?: string;
    email?: string;
    token?: number;
    isDirect?: boolean;
  } = {}
) => {
  if (!options.isDirect) {
    const errors = handleValidationErrors(req, next);
    if (errors) return;
  }
  // optional routes: since in backend action won't have token hence conditional not workin
  const userId = options.isDirect ? options.userId : req.userData?.userId;

  try {
    let user: IUser | null = null;
    if (!options.email) {
      user = await User.findById(userId);
      if (!user) {
        return next(new HttpError("User not found or verification expired. Please re-login or sign up.", 404));
      } else if (user.isEmailVerified) {
        return next(new HttpError("User email already verified!", 409));
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
            " second(s) or verify your last OTP.",
          429,
          delayInSeconds
        )
      );
    }

    const emailToSend = options.email || user?.email;
    if (!emailToSend) {
      return next(new HttpError("Email address is required!", 400));
    }

    // Generate a verification token and set expiration
    const verificationToken = options.token
      ? options.token
      : random(100000, 999999);

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
  const errors = handleValidationErrors(req, next);
  if (errors) return;

  const { otp } = req.body;
  const userId = req.userData?.userId;

  try {
    // Find the user by ID and validate existence
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return next(new HttpError("User not found! Please sign up again.", 404));
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
        EMAIL_VERIFICATION_OTP_EXPIRY * 60 * 1000
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
