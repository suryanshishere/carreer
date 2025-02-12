import { USER_ENV_DATA } from "@shared/env-data";
import POST_DB from "@models/post/post-env-db";
import _ from "lodash";
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
  // ACCOUNT_MODE,
} = USER_ENV_DATA;

export interface IUser extends Document {
  // Authentication and verification fields
  isEmailVerified: boolean;
  emailVerificationToken?: number;
  emailVerificationTokenCreatedAt?: Date;
  passwordResetToken?: number;
  passwordResetTokenCreatedAt?: Date;
  passwordChangedAt?: Date;

  // User identification fields
  email: string;
  password: string;

  // Timestamps and activity fields
  deactivated_at?: Date;

  // Relationships
  detail?: mongoose.Types.ObjectId;
  contribution?: mongoose.Types.ObjectId | string; //contribution model id is contributor id so i have so when needed

  // Saved posts
  saved_posts?: SavedPosts;

  //status for personalised data rendering for the user
  mode?: Record<string, boolean>;
}

const dynamicReferences: Record<string, any> = {};
POST_DB.sections.forEach((key) => {
  const camelCaseRef = _.camelCase(key);
  dynamicReferences[key] = [
    { type: Schema.Types.ObjectId, ref: _.upperFirst(camelCaseRef) },
  ];
});

const savedPostsSchema = new Schema(dynamicReferences, { _id: false });

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

    // User identification fields
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Timestamps and activity fields
    // created_at: { type: Date, default: Date.now },
    deactivated_at: { type: Date },

    // Relationships
    detail: { type: mongoose.Types.ObjectId, ref: "UserDetail" },
    contribution: { type: mongoose.Types.ObjectId, ref: "Contribution" },

    // Saved posts
    saved_posts: { type: savedPostsSchema },

    mode: {
      max: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const UserModal = mongoose.model<IUser>("User", userSchema);
export default UserModal;
