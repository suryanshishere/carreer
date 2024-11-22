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
  savedPosts?: SavedPosts;
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
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },

  // Timestamps and activity fields
  created_at: { type: Date, default: Date.now },
  deactivated_at: { type: Date },

  // Relationships
  detail: { type: mongoose.Types.ObjectId, ref: "AccountDetail" },

  // Saved posts
  savedPosts: {
    answerKeyRef: [{ type: Types.ObjectId, ref: "AnswerKey" }],
    admissionRef: [{ type: Types.ObjectId, ref: "Admission" }],
    admitCardRef: [{ type: Types.ObjectId, ref: "AdmitCard" }],
    certificateRef: [{ type: Types.ObjectId, ref: "CertificateVerification" }],
    postImportantRef: [{ type: Types.ObjectId, ref: "PostImportant" }],
    latestJobRef: [{ type: Types.ObjectId, ref: "LatestJob" }],
    resultRef: [{ type: Types.ObjectId, ref: "Result" }],
    syllabusRef: [{ type: Types.ObjectId, ref: "Syllabus" }],
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
