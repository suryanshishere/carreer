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

// const FRONTEND_URL = "http://localhost:3000/user/email_verification";
const JWT_KEY = process.env.JWT_KEY;
const JWT_KEY_EXPIRY = process.env.JWT_KEY_EXPIRY || "900s";
const EMAIL_TOKEN_EXPIRY =
  process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || "900s";

export const sendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  checkValidationResult(req, res, next);
  const { userId, email } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return next(new HttpError("User not found", 404));
    }

    if (user.email !== email) {
      return next(new HttpError("Email does not match the user's email, change it in setting first if needed!", 400));
    }

    const generateUniqueToken = generateUniqueVerificationToken();

    user.emailVerificationToken = generateUniqueToken;
    user.emailVerificationTokenCreatedAt = new Date();

    await user.save();

    try {
      await sendEmail(
        email,
        "Verify your email through OTP",
        `${generateUniqueToken}`
      );
    } catch (err) {
      return next(
        new HttpError("Error sending verification email, try again later.", 500)
      );
    }

    res.status(200).json({ message: "OTP send to your email successfully" });
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
  checkValidationResult(req, res, next);

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

    // Email verification
    try {
      await sendEmail(
        user.email,
        "Verify your email through OTP",
        `${generateUniqueToken}`
      );
    } catch (err) {
      return next(
        new HttpError(
          "Error sending verification email, try signing up again later.",
          500
        )
      );
    }

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
  checkValidationResult(req, res, next);

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

//locally helper function
const checkValidationResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
};
