import { ADMIN_DATA } from "@shared/env-data";
import { IAdminData } from "@shared/type-check-data";
import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  admin_status?: IAdminData["IAdminStatus"];
  role: IAdminData["IRoleApplied"];
  user: Schema.Types.ObjectId;
}

export const adminSchema: Schema = new Schema<IAdmin>(
  {
    //_id will be userid
    email: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      default: "none",
      enum: ADMIN_DATA.ROLE_APPLIED,
      index: true,
      required: true,
    },
    admin_status: {
      type: String,
      default: "none",
      enum: ADMIN_DATA.ADMIN_STATUS,
      index: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model<IAdmin>("Admin", adminSchema);
export default AdminModel;
