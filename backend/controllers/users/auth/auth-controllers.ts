import { Request, Response, NextFunction } from "express";
import HttpError from "../../../util/http-errors";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "./send-email";
import User from "../../../models/user/user-model";
import { generateUniqueVerificationToken } from "./auth-helpers";

const { JWT_KEY, JWT_KEY_EXPIRY, BASE_URL } = process.env;

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { verificationToken } = req.params;
  const [email, emailVerificationToken] = verificationToken.split("-");
  console.log(email, emailVerificationToken);
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (
        existingUser.emailVerificationToken === emailVerificationToken &&
        existingUser.emailVerificationTokenCreatedAt instanceof Date
      ) {
        // Check if token is still valid (within 3 minutes)
        const tokenExpirationTime = new Date(
          existingUser.emailVerificationTokenCreatedAt.getTime() + 3 * 60 * 1000
        ); // 3 minutes in milliseconds
        const currentTime = new Date();

        if (currentTime < tokenExpirationTime) {
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    let existingUser = await User.findOne({ email: email });

    // If the user exists and has a token, return an error
    if (existingUser) {
      return next(
        new HttpError("User already exists, please login instead.", 409)
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

    const createdUser = new User({
      name,
      username: uuidv4(),
      email,
      password: hashedPassword,
    });

    const generateUniqueToken = generateUniqueVerificationToken();
    const verificationToken = `${email}-${generateUniqueToken}`;
    createdUser.emailVerificationToken = generateUniqueToken;
    createdUser.emailVerificationTokenCreatedAt = new Date();

    await createdUser.save();

    //Email verification
    try {
      await sendEmail(
        createdUser.email,
        "Verify your email through OTP",
        `${BASE_URL}/users/auth/verify_email/${verificationToken}`
      );
    } catch (err) {
      // Handle email sending errors
      return next(
        new HttpError(
          "Error sending verification email, try signing up again later.",
          500
        )
      );
    }

    // if (createdUser.isEmailVerified) {
    //   // Generate a JWT token
    //   let helper_message: string = "";
    //   let token: string;
    //   try {
    //     if (JWT_KEY) {
    //       token = jwt.sign(
    //         { userId: createdUser.id, email: createdUser.email },
    //         JWT_KEY,
    //         { expiresIn: JWT_KEY_EXPIRY || "900s" }
    //       );
    //     } else {
    //       helper_message =
    //         "Internal server error; please re-login later as features are temporarily limited";
    //       throw new HttpError("Internal server error", 500);
    //     }
    //   } catch (err) {
    //     helper_message =
    //       "Internal server error; please re-login later as features are temporarily limited";
    //     // not returning instead throwing, so that i can tell user for now, you logged in but need re-login for jwt generation.
    //     throw new HttpError("Internal server error", 500);
    //   }

    //   // Send a response on successful creation
    //   res.status(201).json({
    //     helper_message,
    //     userId: createdUser.id,
    //     token,
    //   });
    // }else{
    res.status(201).json({
      message:
        "Account created successfully. Verification link sent to your email.",
      userId: createdUser.id,
    });
    // }
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again", 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Validate incoming request body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
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
          message: "Something seem messy. Verify your email first.",
        });
      } else {
        // Handle case where user is verified but password is incorrect
        return next(
          new HttpError("Invalid credentials, could not log you in.", 401)
        );
      }
    }

    // If user is verified, generate JWT token
    if (existingUser.isEmailVerified) {
      let token: string;
      try {
        token = jwt.sign(
          { userId: existingUser.id, email: existingUser.email },
          JWT_KEY as string,
          { expiresIn: JWT_KEY_EXPIRY || "900s" }
        );
      } catch (err) {
        // Handle JWT token generation error
        return next(
          new HttpError(
            "Internal server error; please re-login later as features are temporarily limited",
            500
          )
        );
      }

      // Respond with success message, user ID, and token
      res.status(200).json({
        message: "Login successful.",
        userId: existingUser.id,
        token,
      });
    } else {
      res.status(401).json({
        message: "Features are temporarily limited. Verify your email first.",
        userId: existingUser.id,
      });
    }
  } catch (err) {
    // Handle generic login error
    return next(
      new HttpError("Logging you in failed, please try again later.", 500)
    );
  }
};
