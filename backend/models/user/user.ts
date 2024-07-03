import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  token: boolean;
  saved: mongoose.Types.ObjectId[];
  created_at: Date;
  deactivated_at: Date | null;
  account_info: {
    username: string;
    email: string;
    phone: string;
    country: string;
    language: string;
    gender: string;
    birth_day: Date;
    tag: string[];
  };
  old_email?: string;
  created_exam: mongoose.Types.ObjectId[];
}

const accountInfoSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: null },
  country: { type: String, default: null },
  language: { type: String, default: null },
  gender: { type: String, default: null },
  birth_day: { type: Date, default: null },
  tag: [{ type: String }],
});

const userSchema: Schema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: false },
  token: { type: Boolean, required: true, default: false },
  created_at: { type: Date, default: Date.now },
  deactivated_at: { type: Date, default: null },
  saved: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "ExamList",
    },
  ],
  account_info: { type: accountInfoSchema, required: true },
  old_email: { type: String, default: null },
  created_exam: [
    {
      type: mongoose.Types.ObjectId,
      ref: "ExamList",
    },
  ],
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
