import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  isEmailVerified: boolean;
  emailVerificationToken?: string | undefined;
  emailVerificationTokenCreatedAt?: Date | undefined;
  passwordResetAt?: Date | undefined;
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
  emailVerificationToken: { type: String },
  emailVerificationTokenCreatedAt: { type: Date },
  passwordResetAt: { type: Date },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: { type: Number },
  image: { type: String },
  created_at: { type: Date, default: Date.now },
  deactivated_at: { type: Date },
  detail: { type: mongoose.Types.ObjectId, ref: "AccountDetail" },
});

//expiring the token after the given time
// userSchema.index(
//   { emailVerificationTokenCreatedAt: 1 },
//   { expireAfterSeconds: Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY) }
// );

const User = mongoose.model<IUser>("User", userSchema);
export default User;
