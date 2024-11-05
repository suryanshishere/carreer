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

// // Function to validate a 6-digit number
// const isSixDigitNumber = (v: number): boolean => /^\d{6}$/.test(v.toString());

// // Custom error message for failed validation
// const sixDigitNumberValidator = {
//   validator: isSixDigitNumber,
//   message: (props: { value: number }) =>
//     `${props.value} is not a 6-digit number!`,
// };

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

//expiring the token after the given time
// userSchema.index(
//   { emailVerificationTokenCreatedAt: 1 },
//   { expireAfterSeconds: Number(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY) }
// );

const User = mongoose.model<IUser>("User", userSchema);
export default User;
