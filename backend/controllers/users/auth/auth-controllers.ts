import { Request, Response, NextFunction } from "express";
import HttpError from "@utils/http-errors";
// import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import sendEmail from "./send-email";
import User, { IUser } from "@models/user/user-model";
import {
  calculateTokenExpiration,
  generateUniqueVerificationToken,
  sendAuthenticatedResponse,
  sendVerificationResponse,
  updateUnverifiedUser,
} from "./auth-utils";
// import ms from "ms";
import validationError from "../../controllersHelpers/validation-error";

const FRONTEND_URL =
  `${process.env.FRONTEND_URL}/user/reset_password` ||
  "http://localhost:3000/user/reset_password";
// const JWT_KEY = process.env.JWT_KEY;
// const JWT_KEY_EXPIRY = process.env.JWT_KEY_EXPIRY || "15";
const EMAIL_TOKEN_EXPIRY = process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY || "1";

export const sendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
  options: { userId?: string; email?: string; isDirect?: boolean } = {}
) => {
  if (!options.isDirect) {
    validationError(req, res, next);
  }
  // Use userId and email from options if provided, otherwise from req.body
  const userId = options.userId || req.body.userId;
  const password_reset = req.body.password_reset;

  try {
    // Find the user by ID if not directly passed as an email option
    let user = null;
    if (!options.email) {
      user = await User.findById(userId);
      if (!user) {
        return next(new HttpError("User not found", 404));
      }
    }

    const emailToSend = options.email || user?.email;
    if (!emailToSend) {
      return next(new HttpError("Email address is required", 400));
    }

    // Generate a verification token and set expiration
    const verificationToken = generateUniqueVerificationToken();
    if (user) {
      user.emailVerificationToken = verificationToken;
      user.emailVerificationTokenExpireAt = calculateTokenExpiration(
        Number(process.env.EMAIL_TOKEN_EXPIRY)
      );
      await user.save();
    }

    // Define email content
    const emailSubject = password_reset
      ? "Forgot password and reset"
      : "Verify your email through OTP";
    const emailContent = password_reset
      ? `${process.env.FRONTEND_URL}/reset-password/${user?.id}/${verificationToken}`
      : verificationToken;

    // Send email
    await sendEmail(emailToSend, emailSubject, emailContent);

    // If `isDirect`, skip the response
    if (options.isDirect) return;

    // Respond to client
    res.status(200).json({
      message: password_reset
        ? "Password reset link sent successfully."
        : "OTP sent to your email successfully.",
    });
  } catch (error) {
    next(
      new HttpError("Error sending verification email, try again later.", 500)
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
        existingUser.emailVerificationTokenExpireAt instanceof Date
      ) {
        // token valid till
        const tokenExpirationTime = new Date(
          existingUser.emailVerificationTokenExpireAt.getTime() +
            Number(EMAIL_TOKEN_EXPIRY) * 60 * 1000
        );
        const currentTime = new Date();

        if (currentTime <= tokenExpirationTime) {
          existingUser.isEmailVerified = true;
          existingUser.emailVerificationToken = undefined;
          existingUser.emailVerificationTokenExpireAt = undefined;

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

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    validationError(req, res, next);

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    const verificationToken = generateUniqueVerificationToken();

    if (existingUser) {
      if (!existingUser.isEmailVerified) {
        existingUser.emailVerificationToken = verificationToken;
        existingUser.emailVerificationTokenExpireAt = calculateTokenExpiration(
          Number(EMAIL_TOKEN_EXPIRY)
        );
        await existingUser.save();
        return sendVerificationResponse(req, res, next, existingUser);
      }

      const isValidPassword = await bcrypt.compare(
        password,
        existingUser.password as string
      );
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
        emailVerificationTokenExpireAt: calculateTokenExpiration(
          Number(EMAIL_TOKEN_EXPIRY)
        ),
      });
      await newUser.save();

      return sendVerificationResponse(req, res, next, newUser);
    }
  } catch (err) {
    console.error("Authentication error:", err);
    return next(new HttpError("Authentication failed, please try again.", 500));
  }
};

// export const auth = async (req: Request, res: Response, next: NextFunction) => {
//   validationError(req, res, next);

//   const { email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });

//     let hashedPassword: string;
//     try {
//       hashedPassword = await bcrypt.hash(password, 12);
//     } catch (err) {
//       return next(
//         new HttpError("Authenticating failed, please try again", 500)
//       );
//     }

//     let user: IUser;
//     const generateUniqueToken = generateUniqueVerificationToken();

//     if (existingUser) {
//       if (!existingUser.isEmailVerified) {
//         existingUser.password = hashedPassword;
//         existingUser.emailVerificationToken = generateUniqueToken;
//         existingUser.emailVerificationTokenExpireAt = new Date();
//         await existingUser.save();
//         user = existingUser;
//       } else {
//         user = existingUser;
//         let isValidPassword: boolean;
//         try {
//           // Compare hashed password with provided password
//           isValidPassword = await bcrypt.compare(
//             password,
//             existingUser.password as string
//           );
//         } catch (err) {
//           return next(
//             new HttpError(
//               "Could not log you in right now, please try again later.",
//               500
//             )
//           );
//         }

//         if (!isValidPassword) {
//           return next(
//             new HttpError("Invalid credentials, could not log you in.", 401)
//           );
//         }
//       }
//     } else {
//       user = new User({
//         username: uuidv4(),
//         email,
//         password: hashedPassword,
//         emailVerificationToken: generateUniqueToken,
//         emailVerificationTokenExpireAt: new Date(),
//       });
//       await user.save();
//     }

//     if (!JWT_KEY) {
//       return next(
//         new HttpError("Authenticating failed, please try again", 500)
//       );
//     }

//     // Generate JWT token and do if JWT_KEY present
//     let token: string;
//     try {
//       token = jwt.sign(
//         {
//           userId: user.id,
//           email: user.email,
//         },
//         JWT_KEY,
//         { expiresIn: JWT_KEY_EXPIRY }
//       );
//     } catch (err) {
//       console.error("JWT token generation error:", err);
//       return next(
//         new HttpError("Authenticating failed, please try again", 500)
//       );
//     }

//     if (!user.isEmailVerified) {
//       await sendVerificationEmail(
//         req,
//         res,
//         next,
//         user.id,
//         user.email,
//         token,
//         true
//       );
//     }

//     return res.status(201).json({
//       email: user.email,
//       userId: user.id,
//       token,
//       isEmailVerified: user.isEmailVerified,
//       tokenExpiration: calculateTokenExpiration(Number(JWT_KEY_EXPIRY)),
//       message: user.isEmailVerified
//         ? undefined
//         : "A verification OTP email has been sent. Please verify to complete authentication.",
//     });
//   } catch (err) {
//     return next(new HttpError("Authenticating failed, please try again", 500));
//   }
// };

// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email, password } = req.body;

//   try {
//     validationError(req, res, next);

//     let existingUser = await User.findOne({ email });
//     if (!existingUser) {
//       return next(new HttpError("User not found, please signup instead.", 404));
//     }

//     let isValidPassword: boolean;
//     try {
//       // Compare hashed password with provided password
//       isValidPassword = await bcrypt.compare(
//         password,
//         existingUser.password as string
//       );
//     } catch (err) {
//       return next(
//         new HttpError(
//           "Could not log you in right now, please try again later.",
//           500
//         )
//       );
//     }

//     if (!isValidPassword) {
//       return next(
//         new HttpError("Invalid credentials, could not log you in.", 401)
//       );
//     }

//     let token: string;
//     let tokenExpiry: number;
//     try {
//       // Convert JWT_KEY_EXPIRY from minutes to seconds
//       const expiryInSeconds = parseInt(JWT_KEY_EXPIRY) * 60;

//       token = jwt.sign(
//         { userId: existingUser.id, email: existingUser.email },
//         JWT_KEY as string,
//         { expiresIn: expiryInSeconds }
//       );

//       // Calculate the expiration time in seconds from the current time
//       tokenExpiry = Math.floor(Date.now() / 1000) + expiryInSeconds;
//     } catch (err) {
//       return next(
//         new HttpError(
//           "An unexpected issue occurred while processing your request.",
//           500
//         )
//       );
//     }
//     return res.status(200).json({
//       email: existingUser.email,
//       userId: existingUser.id,
//       token,
//       emailVerified: existingUser.isEmailVerified,
//       tokenExpiration: new Date(tokenExpiry * 1000).toISOString(),
//     });
//   } catch (err) {
//     return next(
//       new HttpError("Logging you in failed, please try again later.", 500)
//     );
//   }
// };

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
        existingUser.emailVerificationTokenExpireAt instanceof Date
      ) {
        // Check if token is still valid (within 3 minutes)
        const tokenExpirationTime = new Date(
          existingUser.emailVerificationTokenExpireAt.getTime() +
            Number(EMAIL_TOKEN_EXPIRY) * 60 * 1000
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
          existingUser.emailVerificationTokenExpireAt = undefined;

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
