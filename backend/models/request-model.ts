import { ADMIN_DATA, CONTACT_US_ENV_DATA } from "@shared/env-data";
import { IAdminData } from "@shared/type-check-data";
import mongoose, { Schema, Document } from "mongoose";

export interface IPublisher extends Document {
  email: string;
  status: IAdminData["IStatus"];
  role_applied: IAdminData["IRoleApplied"];
  reason: string;
  user: Schema.Types.ObjectId;
  admin?: Schema.Types.ObjectId;
  expireAt: Date;
}

const { MIN_REASON_LENGTH, MAX_REASON_LENGTH } = CONTACT_US_ENV_DATA;

export const requestSchema: Schema = new Schema<IPublisher>(
  {
    //_id will be userid
    email: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      default: "pending",
      enum: ADMIN_DATA.STATUS,
      required: true,
      index: true,
    },
    role_applied: {
      type: String,
      //if want to be both admin and publisher, then add "admin" with both as admin_status in enum
      enum: ADMIN_DATA.ROLE_APPLIED,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      min: MIN_REASON_LENGTH,
      max: MAX_REASON_LENGTH,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    admin: { type: Schema.Types.ObjectId, ref: "Admin" },
    //only set expireAt when role_applied matches the rejected done so.
    expireAt: { type: Date, expires: ADMIN_DATA.REQUEST_DOC_EXPIRY }, // TTL index set to 30 days as type date
  },
  { timestamps: true }
);

const RequestModal = mongoose.model<IPublisher>("Request", requestSchema);
export default RequestModal;
