import { ADMIN_DATA } from "@shared/env-data";
import { IAdminData } from "@shared/type-check-data";
import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  // admin_status?: IAdminData["IAdminStatus"];
  role: IAdminData["IRoleApplied"];
  user: Schema.Types.ObjectId;
}

//temp: explicitly called it for admin, and role will be on admin only.
//temp: admin have approver, publisher and other list power and work
export const adminSchema: Schema = new Schema<IAdmin>(
  {
    //_id will be userid
    role: {
      type: String,
      default: "none",
      enum: ADMIN_DATA.ROLE_APPLIED,
      index: true,
      required: true,
    },
    // admin_status: {
    //   type: String,
    //   enum: ADMIN_DATA.ADMIN_STATUS,
    //   index: true,
    // },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const AdminModel = mongoose.model<IAdmin>("Admin", adminSchema);
export default AdminModel;
