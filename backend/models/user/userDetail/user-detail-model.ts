import mongoose, { Schema, Document } from "mongoose";
import  dateHandler  from "../../helper/date-handler";

export interface IUserDetail extends Document {
  _id: string;
  old_email?: string;
  country_phone_code?: Number;
  language?: string;
  gender?: "male" | "female" | "other";
  date_of_birth?: { type: Date; default: null };
}

const userDetailSchema: Schema = new Schema<IUserDetail>({
  _id: { type: String, required: true },
  old_email: { type: String},
  country_phone_code: { type: Number },
  language: { type: String },
  gender: { type: String },
  date_of_birth: { type: Date, set: dateHandler },
});

const AccountDetail = mongoose.model<IUserDetail>(
  "UserDetail",
  userDetailSchema
);
export default AccountDetail;
