import { Request, Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "./send-email";
import User, { IUser } from "@models/user/user-model";
import { generateUniqueVerificationToken } from "./auth-helpers";
import ms from "ms";
import validationError from "../validation-error";

const FRONTEND_URL = "http://localhost:3000/user/reset_password";
const JWT_KEY = process.env.JWT_KEY;
const JWT_KEY_EXPIRY = process.env.JWT_KEY_EXPIRY || "900s";
const EMAIL_TOKEN_EXPIRY =
  process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || "900s";

// sendVerification is reuse for sending token when forgot password
export const sendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);
  const { userId, email } = req.body;
  //assuming that if userId is null, then it's for forgot password.

  try {
    let user: IUser | null = null;

    if (userId) {
      user = await User.findById(userId);
    } else {
      const users = await User.find({ email });
      user = users.length > 0 ? users[0] : null;
    }

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (user.email !== email) {
      return next(
        new HttpError(
          "Email does not match the user's email, change it in settings first if needed!",
          400
        )
      );
    }

    const generateUniqueToken = generateUniqueVerificationToken();

    user.emailVerificationToken = generateUniqueToken;
    user.emailVerificationTokenCreatedAt = new Date();

    await user.save();

    try {
      await sendEmail(
        email,
        userId ? "Verify your email through OTP" : "Forgot password and reset",
        userId
          ? `${generateUniqueToken}`
          : `${FRONTEND_URL}/${user.id}${generateUniqueToken}`
      );
    } catch (err) {
      return next(
        new HttpError("Error sending verification email, try again later.", 500)
      );
    }

    res.status(200).json({
      message: userId
        ? "OTP send to your email successfully."
        : "Password reset link send successfully.",
    });
  } catch (err) {
    console.error("Send verification email error:", err);
    return next(
      new HttpError("Sending verification email failed, please try again", 500)
    );
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);
  const { verificationToken } = req.body;

  if (verificationToken.length != 30) {
    return next(new HttpError("Invalid verification credentials.", 400));
  }

  const userId = verificationToken.slice(0, -6);
  const emailVerificationToken = verificationToken.slice(-6);
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
            Number(EMAIL_TOKEN_EXPIRY) * 1000
        ); // 3 minutes in milliseconds
        const currentTime = new Date();

        if (currentTime <= tokenExpirationTime) {
          existingUser.isEmailVerified = true;
          existingUser.emailVerificationToken = undefined;
          existingUser.emailVerificationTokenCreatedAt = undefined;

          await existingUser.save();
          return res
            .status(200)
            .json({ message: "Email successfully verified." });
        } else {
          return next(
            new HttpError(
              "Expired verification token. Please request a new verification email.",
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

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);

  const { name, email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email });

    // If the user exists and isEmailVerified, return an error
    if (existingUser && existingUser.isEmailVerified) {
      return next(
        new HttpError("User already exists, please login instead.", 409)
      );
    }

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

    let user: IUser;
    const generateUniqueToken = generateUniqueVerificationToken();

    // if existinguser and email not verified, we will overide the user identity with other one.
    if (existingUser && !existingUser.isEmailVerified) {
      existingUser.name = name;
      existingUser.password = hashedPassword;
      existingUser.emailVerificationToken = generateUniqueToken;
      existingUser.emailVerificationTokenCreatedAt = new Date();
      user = existingUser;
    } else {
      user = new User({
        name,
        username: uuidv4(),
        email,
        password: hashedPassword,
        emailVerificationToken: generateUniqueToken,
        emailVerificationTokenCreatedAt: new Date(),
      });
    }

    await user.save();

    // Generate JWT token
    let token: string;
    let tokenExpiry: number;
    try {
      token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_KEY as string,
        { expiresIn: JWT_KEY_EXPIRY }
      );
      tokenExpiry = Math.floor(Date.now() / 1000) + ms(JWT_KEY_EXPIRY) / 1000;
    } catch (err) {
      console.error("JWT token generation error:", err);
      return next(
        new HttpError(
          "Internal server error; please re-login later as features are temporarily limited",
          500
        )
      );
    }

    return res.status(201).json({
      email: user.email,
      userId: user.id,
      token,
      emailVerified: user.isEmailVerified,
      tokenExpiration: new Date(tokenExpiry * 1000).toISOString(),
    });
  } catch (err) {
    console.error("Signup error:", err);
    return next(new HttpError("Signing up failed, please try again", 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validationError(req, res, next);

  const { email, password } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new HttpError("User not found, please signup instead.", 404));
    }

    let isValidPassword: boolean;
    try {
      // Compare hashed password with provided password
      isValidPassword = await bcrypt.compare(
        password,
        existingUser.password as string
      );
    } catch (err) {
      return next(
        new HttpError(
          "Could not log you in right now, please try again later.",
          500
        )
      );
    }

    if (!isValidPassword) {
      return next(
        new HttpError("Invalid credentials, could not log you in.", 401)
      );
    }

    let token: string;
    let tokenExpiry: number;
    try {
      token = jwt.sign(
        { userId: existingUser.id, email: existingUser.email },
        JWT_KEY as string,
        { expiresIn: JWT_KEY_EXPIRY }
      );
      tokenExpiry = Math.floor(Date.now() / 1000) + ms(JWT_KEY_EXPIRY) / 1000;
    } catch (err) {
      return next(
        new HttpError(
          "Internal server error; please re-login later as features are temporarily limited",
          500
        )
      );
    }

    res.status(200).json({
      email: existingUser.email,
      userId: existingUser.id,
      token,
      emailVerified: existingUser.isEmailVerified,
      tokenExpiration: new Date(tokenExpiry * 1000).toISOString(),
    });
  } catch (err) {
    // Handle generic login error
    return next(
      new HttpError("Logging you in failed, please try again later.", 500)
    );
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
            Number(EMAIL_TOKEN_EXPIRY) * 1000
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
          existingUser.passwordResetAt = currentTime;
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
