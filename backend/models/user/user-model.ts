import { postRefs } from "@models/post/post-model";
import mongoose, { Schema, Types, Document } from "mongoose";

interface SavedPosts {
  [key: string]: Types.ObjectId[];
}

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
  created_at: Date;
  deactivated_at?: Date;

  // Relationships
  detail?: mongoose.Types.ObjectId;

  // Saved posts
  saved_posts?: SavedPosts;
}

const userSchema: Schema = new Schema<IUser>({
  // Authentication and verification fields
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: Number },
  emailVerificationTokenCreatedAt: { type: Date },
  passwordResetToken: { type: Number },
  passwordResetTokenCreatedAt: { type: Date },
  passwordChangedAt: { type: Date },

  // User identification fields
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Timestamps and activity fields
  created_at: { type: Date, default: Date.now },
  deactivated_at: { type: Date },

  // Relationships
  detail: { type: mongoose.Types.ObjectId, ref: "AccountDetail" },

  // Saved posts
  saved_posts: {
    answer_key_ref: [{ type: Types.ObjectId, ref: "AnswerKey" }],
    admission_ref: [{ type: Types.ObjectId, ref: "Admission" }],
    admit_card_ref: [{ type: Types.ObjectId, ref: "AdmitCard" }],
    certificate_verification_ref: [
      { type: Types.ObjectId, ref: "CertificateVerification" },
    ],
    important_ref: [{ type: Types.ObjectId, ref: "PostImportant" }],
    latest_job_ref: [{ type: Types.ObjectId, ref: "LatestJob" }],
    result_ref: [{ type: Types.ObjectId, ref: "Result" }],
    syllabus_ref: [{ type: Types.ObjectId, ref: "Syllabus" }],
  },
});

export const allowedPostFields = [
  "answer_key_ref",
  "admission_ref",
  "admit_card_ref",
  "certificate_verification_ref",
  "important_ref",
  "latest_job_ref",
  "result_ref",
  "syllabus_ref",
];

const User = mongoose.model<IUser>("User", userSchema);
export default User;
