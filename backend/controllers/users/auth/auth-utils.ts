import { IUser } from "@models/user/user-model";
import { sendVerificationEmail } from "./auth-controllers";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextFunction, Response, Request } from "express";

const JWT_KEY = process.env.JWT_KEY;
const JWT_KEY_EXPIRY = process.env.JWT_KEY_EXPIRY || "15";
const EMAIL_TOKEN_EXPIRY = process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || "1";

// Function to generate OTP as a verification token
export const generateUniqueVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Calculate expiration date based on minutes
export const calculateTokenExpiration = (expiryInMinutes: number): Date => {
  if (typeof expiryInMinutes !== "number" || expiryInMinutes <= 0) {
    throw new Error("Invalid expiry time provided. It should be a positive number.");
  }
  const currentTime = Date.now();
  const expiryTimeInMilliseconds = expiryInMinutes * 60 * 1000;
  return new Date(currentTime + expiryTimeInMilliseconds);
};

// Update unverified user fields with new password and verification token
export const updateUnverifiedUser = async (
  user: IUser,
  password: string,
  token: string
) => {
  user.password = await bcrypt.hash(password, 12);
  user.emailVerificationToken = token;
  user.emailVerificationTokenExpireAt = calculateTokenExpiration(Number(EMAIL_TOKEN_EXPIRY));
  await user.save();
};

// Send verification response with token and expiration
export const sendVerificationResponse = async (
  req: Request,
  res: Response,
  next: NextFunction,
  user: IUser
) => {
  const token = generateToken(user.id, user.email);
  await sendVerificationEmail(req, res, next, user.id, user.email, token, true);

  return res.status(201).json({
    email: user.email,
    userId: user.id,
    token,
    isEmailVerified: false,
    tokenExpiration: calculateTokenExpiration(Number(JWT_KEY_EXPIRY)).toISOString(), // Ensure ISO string format
    message: "A verification OTP email has been sent. Please verify to complete authentication.",
  });
};

// Send authenticated response for verified users
export const sendAuthenticatedResponse = (res: Response, user: IUser) => {
  const token = generateToken(user.id, user.email);

  return res.status(200).json({
    email: user.email,
    userId: user.id,
    token,
    isEmailVerified: true,
    tokenExpiration: calculateTokenExpiration(Number(JWT_KEY_EXPIRY)).toISOString(),
  });
};

// JWT Token generation function
export const generateToken = (userId: string, email: string): string => {
  if (!JWT_KEY) throw new Error("JWT key not found");

  return jwt.sign({ userId, email }, JWT_KEY, { expiresIn: `${JWT_KEY_EXPIRY}m` }); // Specify expiry in minutes
};