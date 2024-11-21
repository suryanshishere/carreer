import mongoose, { Schema, Document } from "mongoose";

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
  deactivated_at?: Date | null;

  // Relationships
  detail?: mongoose.Types.ObjectId;

  // Saved posts
  savedPosts?: mongoose.Types.ObjectId[];
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
  savedPosts: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
