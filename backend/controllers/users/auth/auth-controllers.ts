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

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const JWT_KEY = process.env.JWT_KEY;
const JWT_KEY_EXPIRY = process.env.JWT_KEY_EXPIRY || "900s";
const EMAIL_TOKEN_EXPIRY = process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || "900s";

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { verificationToken } = req.params;
  const [email, emailVerificationToken] = verificationToken.split("-");
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (
        existingUser.emailVerificationToken === emailVerificationToken &&
        existingUser.emailVerificationTokenCreatedAt instanceof Date
      ) {
        // Check if token is still valid (within 3 minutes)
        const tokenExpirationTime = new Date(
          existingUser.emailVerificationTokenCreatedAt.getTime() + Number(EMAIL_TOKEN_EXPIRY) * 1000
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
    const verificationToken = `${email}-${generateUniqueToken}`;

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
        `${BASE_URL}/users/auth/verify_email/${verificationToken}`
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
      message:
        "Account created successfully. Verification link sent to your email.",
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

    // Handle invalid password scenarios
    if (!isValidPassword) {
      // If user is not verified, send verification email and restrict features temporarily
      if (!existingUser.isEmailVerified) {
        const generateUniqueToken = generateUniqueVerificationToken();
        const verificationToken = `${email}-${generateUniqueToken}`;
        existingUser.emailVerificationToken = generateUniqueToken;
        existingUser.emailVerificationTokenCreatedAt = new Date();

        await existingUser.save();

        // Send verification email
        try {
          await sendEmail(
            existingUser.email,
            "Verify your email through OTP",
            `${BASE_URL}/users/auth/verify_email/${verificationToken}`
          );
        } catch (err) {
          return next(
            new HttpError(
              "Error sending verification email, try again later.",
              500
            )
          );
        }

        return res.status(401).json({
          message:
            "Something seem messy. Verify your email first or do signup again.",
        });
      } else {
        // Handle case where user is verified but password is incorrect
        return next(
          new HttpError("Invalid credentials, could not log you in.", 401)
        );
      }
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
      message: "Login successful.",
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

