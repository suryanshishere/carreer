import POST_DB, { ITagKey } from "@models/posts/db";
import _ from "lodash";
import mongoose, { Schema, Types, Document } from "mongoose";
import { USER_ENV_DATA } from "./db";

const {
  MIN_EMAIL_OTP,
  MAX_EMAIL_OTP,
  PWD_RESET_ERROR_MSG,
  OTP_ERROR_MSG,
  EMAIL_VERIFICATION_OTP_EXPIRY,
  PASSWORD_RESET_TOKEN_EXPIRY,
  // ACCOUNT_MODE,
  EMAIL_UNVERIFIED_EXPIRY,
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
  saved_posts?: { [key: string]: Types.ObjectId[] };

  //status for personalised data rendering for the user
  mode: {
    max: boolean;
    tags: Record<ITagKey, boolean>;
  };

  expireAt?: Date;
}

const dynamicReferences: Record<string, any> = {};
POST_DB.sections.forEach((section) => {
  dynamicReferences[section] = [{ type: Schema.Types.ObjectId, ref: "Post" }];
});

const savedPostsSchema = new Schema(dynamicReferences, { _id: false });

const userSchema: Schema = new Schema<IUser>(
  {
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
      type: {
        max: { type: Boolean, required: true, default: true },
        tags: {
          live: { type: Boolean, required: true, default: false },
          upcoming: { type: Boolean, required: true, default: false },
          released: { type: Boolean, required: true, default: false },
          expiring: { type: Boolean, required: true, default: false },
          none: { type: Boolean, required: true, default: true },
        },
      },
      required: true,
      default: {
        max: true,
        tags: {
          live: false,
          upcoming: false,
          released: false,
          expiring: false,
          none: true,
        },
      },
    },

    // Field to auto-delete unverified users
    expireAt: { type: Date },
  },
  { timestamps: true }
);

// Pre-save middleware to set expireAt only when creating an unverified user
userSchema.pre("save", function (next) {
  if (!this.isEmailVerified) {
    this.expireAt = new Date(Date.now() + EMAIL_UNVERIFIED_EXPIRY * 60 * 1000);
  } else {
    this.expireAt = undefined;
  }
  next();
});

// TTL Index: Documents will be removed when expireAt < current time
userSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

// When the user verifies their email, update the document to remove the expireAt field.
// This logic would typically be part of your verification route/controller.
userSchema.methods.markEmailVerified = async function () {
  this.isEmailVerified = true;
  // Remove expireAt to prevent deletion
  this.expireAt = undefined;
  await this.save();
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
