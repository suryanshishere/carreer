import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  isEmailVerified: boolean;
  emailVerificationToken?: number;
  emailVerificationTokenCreatedAt?: Date;
  passwordResetToken?: number;
  passwordResetTokenCreatedAt?: Date;
  passwordChangedAt?: Date;
  name: string;
  username: string;
  email: string;
  password: string;
  created_at: Date;
  phone_number?: number;
  image?: string;
  deactivated_at?: Date | null;
  detail?: mongoose.Types.ObjectId;
}

const userSchema: Schema = new Schema<IUser>({
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: Number },
  emailVerificationTokenCreatedAt: { type: Date },
  passwordResetToken: { type: Number },
  passwordResetTokenCreatedAt: { type: Date },
  passwordChangedAt: { type: Date },
  name: { type: String, required: true, default: "Cool" },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: Number },
  image: { type: String },
  created_at: { type: Date, default: Date.now },
  deactivated_at: { type: Date },
  detail: { type: mongoose.Types.ObjectId, ref: "AccountDetail" },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
