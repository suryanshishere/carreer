import { IUser } from "@models/user/user-model";
import { sendVerificationOtp } from "./auth-controllers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextFunction, Response, Request } from "express";

const JWT_KEY = process.env.JWT_KEY;
const JWT_KEY_EXPIRY = process.env.JWT_KEY_EXPIRY || "15";
const EMAIL_VERIFICATION_TOKEN_EXPIRY =
  Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY) || 3;

// Function to generate OTP as a verification token
export const generateUniqueVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Update unverified user fields with new password and verification token
export const updateUnverifiedUser = async (user: IUser, password: string) => {
  user.password = await bcrypt.hash(password, 12);
  user.emailVerificationToken = generateUniqueVerificationToken();
  user.emailVerificationTokenCreatedAt = new Date();
  await user.save();
};

// Send verification response with token and expiration
export const sendVerificationResponse = async (
  req: Request,
  res: Response,
  next: NextFunction,
  user: IUser
) => {
  const options = { userId: user.id, email: user.email, isDirect: true };

  // Call sendVerificationOtp
  await sendVerificationOtp(req, res, next, options);

  return sendAuthenticatedResponse(res, user, false);
};

// Send authenticated response for verified users
export const sendAuthenticatedResponse = (
  res: Response,
  user: IUser,
  isEmailVerified: boolean = true
) => {
  const token = generateJWTToken(user.id, user.email);
  const tokenExpiration = new Date(
    Date.now() + Number(JWT_KEY_EXPIRY) * 60000
  ).toISOString();

  return res.status(200).json({
    email: user.email,
    userId: user.id,
    token,
    isEmailVerified,
    tokenExpiration: tokenExpiration,
    message: isEmailVerified ? "Logged in successfully!" : "An OTP verification being sent to your mail.",
  });
};

// JWT Token generation function
export const generateJWTToken = (userId: string, email: string): string => {
  if (!JWT_KEY) throw new Error("JWT key not found");

  return jwt.sign({ userId, email }, JWT_KEY, {
    expiresIn: `${JWT_KEY_EXPIRY}m`,
  }); // Specify expiry in minutes
};

// Revised checkRequestDelay function
export const checkRequestDelay = (
  tokenCreatedAt: Date | null | undefined,
  delayInSeconds: number
): number | null => {
  if (!tokenCreatedAt || isNaN(tokenCreatedAt.getTime())) {
    // If tokenCreatedAt is null, undefined, or invalid, treat as no delay needed
    return null;
  }
  // Check if tokenCreatedAt is a future date
  if (tokenCreatedAt > new Date()) {
    return null; // No delay needed if the token is in the future
  }
  const timeElapsed = Date.now() - tokenCreatedAt.getTime();
  const delayInMilliseconds = delayInSeconds * 1000;

  if (timeElapsed < delayInMilliseconds) {
    // Calculate the remaining wait time in seconds
    return Math.ceil((delayInMilliseconds - timeElapsed) / 1000);
  }

  // No delay needed, enough time has passed
  return null;
};
