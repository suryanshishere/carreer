import { USER_ENV_DATA } from "@shared/env-data";
import mongoose, { Schema, Types, Document } from "mongoose";

interface SavedPosts {
  [key: string]: Types.ObjectId[];
}

const {
  MIN_EMAIL_OTP,
  MAX_EMAIL_OTP,
  PWD_RESET_ERROR_MSG,
  OTP_ERROR_MSG,
  EMAIL_VERIFICATION_OTP_EXPIRY,
  PASSWORD_RESET_TOKEN_EXPIRY,
} = USER_ENV_DATA;

export interface IUser extends Document {
  // Authentication and verification fields
  isEmailVerified: boolean;
  emailVerificationToken?: number;
  emailVerificationTokenCreatedAt?: Date;
  passwordResetToken?: number;
  passwordResetTokenCreatedAt?: Date;
  passwordChangedAt?: Date;

  // Role
  role?: "publisher" | "approver" | "contributor";

  // User identification fields
  email: string;
  password: string;

  // Timestamps and activity fields
  deactivated_at?: Date;

  // Relationships
  detail?: mongoose.Types.ObjectId;

  // Saved posts
  saved_posts?: SavedPosts;
}

const userSchema: Schema = new Schema<IUser>(
  {
    // Authentication and verification fields
    //todo: add expire below
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: {
      type: Number,
      min: [MIN_EMAIL_OTP, OTP_ERROR_MSG],
      max: [MAX_EMAIL_OTP, OTP_ERROR_MSG],
      expires: EMAIL_VERIFICATION_OTP_EXPIRY * 60,
    },
    emailVerificationTokenCreatedAt: {
      type: Date,
      expires: PASSWORD_RESET_TOKEN_EXPIRY * 60,
    },
    passwordResetToken: {
      type: Number,
      min: [MIN_EMAIL_OTP, PWD_RESET_ERROR_MSG],
      max: [MAX_EMAIL_OTP, PWD_RESET_ERROR_MSG],
      expires: PASSWORD_RESET_TOKEN_EXPIRY * 60,
    },
    passwordResetTokenCreatedAt: {
      type: Date,
      expires: PASSWORD_RESET_TOKEN_EXPIRY * 60,
    },
    passwordChangedAt: { type: Date }, //todo

    //role
    role: {
      type: String,
      enum: ["publisher", "approver", "contributor"],
      default: "contributor",
      index: true, //for better fitlering
    },

    // User identification fields
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Timestamps and activity fields
    // created_at: { type: Date, default: Date.now },
    deactivated_at: { type: Date },

    // Relationships
    detail: { type: mongoose.Types.ObjectId, ref: "AccountDetail" },

    // Saved posts
    saved_posts: {
      answer_key: [{ type: Schema.Types.ObjectId, ref: "AnswerKey" }],
      admission: [{ type: Schema.Types.ObjectId, ref: "Admission" }],
      admit_card: [{ type: Schema.Types.ObjectId, ref: "AdmitCard" }],
      certificate_verification: [
        { type: Schema.Types.ObjectId, ref: "CertificateVerification" },
      ],
      important: [{ type: Schema.Types.ObjectId, ref: "Important" }],
      latest_job: [{ type: Schema.Types.ObjectId, ref: "LatestJob" }],
      result: [{ type: Schema.Types.ObjectId, ref: "Result" }],
      syllabus: [{ type: Schema.Types.ObjectId, ref: "Syllabus" }],
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
